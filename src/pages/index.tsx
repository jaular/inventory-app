import type { PostProps } from "~/lib/types";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Group, Modal } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
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
  const { data, isSuccess } = api.post.getAll.useQuery();

  const createPost = api.post.create.useMutation({
    async onSuccess() {
      await utils.post.getAll.invalidate();
    },
  });

  const updatePost = api.post.update.useMutation({
    async onSuccess() {
      await utils.post.getAll.invalidate();
    },
  });

  const deletePost = api.post.delete.useMutation({
    async onSuccess() {
      await utils.post.getAll.invalidate();
    },
  });

  const form = useForm({
    validate: zodResolver(postSchema),
    initialValues: postInitialValues,
    transformValues: (values) => ({
      ...values,
      macE: values.macE.toUpperCase(),
    }),
  });

  const handleReset = () => {
    form.reset();
    setCreateState(true);
    setFormModalOpened(false);
  };

  const handleSubmit = async (post: PostProps) => {
    try {
      if (createState) {
        await createPost.mutateAsync(post);
      } else {
        await updatePost.mutateAsync(post);
      }
      handleReset();
    } catch {}
  };

  const handleUpdate = (post: PostProps) => {
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

  const modelWidth = useMediaQuery("(max-width: 1200px)") ? "100%" : "85%";

  if (sessionData && sessionData?.user.role !== "none") {
    return (
      <Container>
        <Modal
          className={classes.modal}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
          size={modelWidth}
          title={createState ? "Crear" : "Actualizar"}
          opened={formModalOpened}
          onClose={() => handleReset()}
        >
          <Form
            form={form}
            createState={createState}
            createPost={createPost.isLoading}
            updatePost={updatePost.isLoading}
            onSubmit={handleSubmit}
            onReset={handleReset}
          />
        </Modal>

        <Group justify="center" className="mt-8">
          <Button variant="default" onClick={() => setFormModalOpened(true)}>
            Añadir nuevo elemento
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
    <Container>
      <div className="text-center">
        <p>You are not authorized to view this page!</p>
      </div>
    </Container>
  );
}