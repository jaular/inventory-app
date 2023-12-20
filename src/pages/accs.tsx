import type { AccProps } from "~/lib/types";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Group, Modal, Loader, Center } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { api } from "~/utils/api";
import { accSchema } from "~/lib/schema";
import { accInitialValues } from "~/lib/data";
import Container from "~/components/Container";
import AccForm from "~/components/AccForm";
import AccTableList from "~/components/AccTableList";
import classes from "~/styles/modal.module.css";

export default function AccPage() {
  const [formModalOpened, setFormModalOpened] = useState<boolean>(false);
  const [createState, setCreateState] = useState<boolean>(true);

  const { data: sessionData } = useSession();

  const utils = api.useUtils();
  const { data, isSuccess, isLoading } = api.acc.getAll.useQuery();

  const createAcc = api.acc.create.useMutation({
    async onSuccess() {
      await utils.acc.getAll.invalidate();
    },
  });

  const updateAcc = api.acc.update.useMutation({
    async onSuccess() {
      await utils.acc.getAll.invalidate();
    },
  });

  const deleteAcc = api.acc.delete.useMutation({
    async onSuccess() {
      await utils.acc.getAll.invalidate();
    },
  });

  const form = useForm({
    validate: zodResolver(accSchema),
    initialValues: accInitialValues,
    transformValues: (values) => ({
      ...values,
    }),
  });

  const handleReset = () => {
    form.reset();
    setCreateState(true);
    setFormModalOpened(false);
  };

  const handleSubmit = async (acc: AccProps) => {
    try {
      if (createState) {
        await createAcc.mutateAsync(acc);
      } else {
        await updateAcc.mutateAsync(acc);
      }
      handleReset();
    } catch {}
  };

  const handleUpdate = (acc: AccProps) => {
    Object.entries(acc).forEach(([key, value]) => {
      form.setFieldValue(key, value);
    });
    setCreateState(false);
    setFormModalOpened(true);
  };

  const handleDelete = async (n: string) => {
    const input = { n };
    try {
      await deleteAcc.mutateAsync(input);
      handleReset();
    } catch {}
  };

  const modelWidth = useMediaQuery("(max-width: 1200px)") ? "100%" : "70%";

  if (isLoading) {
    return (
      <Container title="Inventario (Accesorios)">
        <Center h={300}>
          <Loader color="blue" size="lg" />
        </Center>
      </Container>
    );
  }

  if (sessionData && sessionData?.user.role !== "none") {
    return (
      <Container title="Inventario (Accesorios)">
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
          <AccForm
            form={form}
            createState={createState}
            createAcc={createAcc.isLoading}
            updateAcc={updateAcc.isLoading}
            onSubmit={handleSubmit}
            onReset={handleReset}
          />
        </Modal>

        <h1 className="text-center text-lg font-medium md:text-xl">
          Inventario (Accesorios)
        </h1>

        <Group justify="center" className="mt-8">
          <Button variant="default" onClick={() => setFormModalOpened(true)}>
            Añadir elemento
          </Button>
        </Group>

        <div className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6 md:mt-24 lg:px-8">
          <AccTableList
            data={isSuccess ? data : []}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>
      </Container>
    );
  }

  return (
    <Container title="Inventario (Accesorios)">
      <div className="text-center">
        <p>You are not authorized to view this page!</p>
      </div>
    </Container>
  );
}
