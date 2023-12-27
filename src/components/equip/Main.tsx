import type { PostProps } from "~/lib/types";
import { useState } from "react";
import { Modal } from "@mantine/core";
// import { useMediaQuery } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { api } from "~/utils/api";
import { postSchema } from "~/lib/schema";
import { postInitialValues } from "~/lib/data";
import Form from "~/components/equip/Form";
import TableList from "~/components/equip/TableList";
import classes from "~/styles/modal.module.css";

export default function Main() {
  const [formModalOpened, setFormModalOpened] = useState<boolean>(false);
  const [createState, setCreateState] = useState<boolean>(true);

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

  return (
    <>
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

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold md:text-3xl">
          Inventario de equipos
        </h1>
      </div>

      <div className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <TableList
          data={isSuccess ? data : []}
          dataIsLoading={isLoading}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          FormModalOpened={setFormModalOpened}
        />
      </div>
    </>
  );
}
