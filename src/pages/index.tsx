import type { PostProps } from "~/lib/types";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Group, Modal, Loader, Center } from "@mantine/core";
// import { useMediaQuery } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { api } from "~/utils/api";
import { postSchema } from "~/lib/schema";
import { postInitialValues } from "~/lib/data";
import Container from "~/components/Container";
import Form from "~/components/Form";
import TableList from "~/components/TableList";
import classes from "~/styles/modal.module.css";

export default function Home() {
  const [formModalOpened, setFormModalOpened] = useState<boolean>(false);
  const [createState, setCreateState] = useState<boolean>(true);

  const { data: sessionData } = useSession();

  const utils = api.useUtils();
  const { data, isSuccess, isLoading } = api.post.getAll.useQuery();

  const createPost = api.post.create.useMutation({
    async onSuccess() {
      await utils.post.getAll.invalidate();
      notifications.show({
        message: "Elemento creado",
      });
    },
  });
  const createAccTracking = api.post.createTracking.useMutation();

  const updatePost = api.post.update.useMutation({
    async onSuccess() {
      await utils.post.getAll.invalidate();
      notifications.show({
        message: "Elemento actualizado",
      });
    },
  });

  const deletePost = api.post.delete.useMutation({
    async onSuccess() {
      await utils.post.getAll.invalidate();
      notifications.show({
        message: "Elemento eliminado",
      });
    },
  });

  const form = useForm({
    validate: zodResolver(postSchema),
    initialValues: postInitialValues,
    transformValues: (values) => ({
      ...values,
      // macE: values.macE.toUpperCase(),
      name: values.name.toUpperCase(),
      accessories: createState
        ? values.accessories.slice(1)
        : values.accessories,
    }),
  });

  const handleReset = () => {
    form.setInitialValues(postInitialValues);
    form.reset();
    setCreateState(true);
    setFormModalOpened(false);
  };

  const handleSubmit = async (post: PostProps) => {
    try {
      if (createState) {
        const data = await createPost.mutateAsync(post);
        await createAccTracking.mutateAsync(data);
      } else {
        const data = await updatePost.mutateAsync(post);
        await createAccTracking.mutateAsync(data);
      }
      handleReset();
    } catch {}
  };

  const handleUpdate = (post: PostProps) => {
    form.setInitialValues(post);
    Object.entries(post).forEach(([key, value]) => {
      form.setFieldValue(key, value);
    });
    setCreateState(false);
    setFormModalOpened(true);
  };

  const handleDelete = async (n: string) => {
    const input = { n };
    try {
      await deletePost.mutateAsync(input);
      handleReset();
    } catch {}
  };

  // const modelWidth = useMediaQuery("(max-width: 1200px)") ? "100%" : "70%";

  if (isLoading) {
    return (
      <Container title="Inventario (Equipos)">
        <Center h={300}>
          <Loader color="blue" size="lg" />
        </Center>
      </Container>
    );
  }

  if (sessionData && sessionData?.user.role !== "none") {
    return (
      <Container title="Inventario (Equipos)">
        <Modal
          fullScreen
          className={classes.modal}
          // overlayProps={{
          //   backgroundOpacity: 0.55,
          //   blur: 3,
          // }}
          // size={modelWidth}
          title={createState ? "Crear" : "Actualizar"}
          opened={formModalOpened}
          onClose={() => handleReset()}
        >
          {formModalOpened && (
            <Form
              form={form}
              createState={createState}
              createPost={createPost.isLoading}
              updatePost={updatePost.isLoading}
              onSubmit={handleSubmit}
              onReset={handleReset}
            />
          )}
        </Modal>

        <h1 className="text-center text-lg font-medium md:text-2xl">Equipos</h1>

        <Group justify="center" className="mt-8">
          <Button variant="default" onClick={() => setFormModalOpened(true)}>
            Añadir elemento
          </Button>
        </Group>

        <div className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6 md:mt-24 lg:px-8">
          <TableList
            data={isSuccess ? data : []}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>
      </Container>
    );
  }

  return (
    <Container title="Inventario (Equipos)">
      <p className="text-center text-lg font-medium md:text-2xl">
        ¡No est&aacute;s autorizado a ver esta p&aacute;gina!
      </p>
    </Container>
  );
}
