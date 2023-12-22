import type { AccProps } from "~/lib/types";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Group, Modal, Loader, Center } from "@mantine/core";
// import { useMediaQuery } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
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
      notifications.show({
        message: "Elemento creado",
      });
    },
  });
  const createAccTracking = api.acc.createTracking.useMutation();

  const updateAcc = api.acc.update.useMutation({
    async onSuccess() {
      await utils.acc.getAll.invalidate();
      notifications.show({
        message: "Elemento actualizado",
      });
    },
  });

  const deleteAcc = api.acc.delete.useMutation({
    async onSuccess() {
      await utils.acc.getAll.invalidate();
      notifications.show({
        message: "Elemento eliminado",
      });
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
        const data = await createAcc.mutateAsync(acc);
        await createAccTracking.mutateAsync(data);
      } else {
        const data = await updateAcc.mutateAsync(acc);
        await createAccTracking.mutateAsync(data);
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

  // const modelWidth = useMediaQuery("(max-width: 1200px)") ? "100%" : "70%";

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
            <AccForm
              form={form}
              createState={createState}
              createAcc={createAcc.isLoading}
              updateAcc={updateAcc.isLoading}
              onSubmit={handleSubmit}
              onReset={handleReset}
            />
          )}
        </Modal>

        <h1 className="text-center text-lg font-medium md:text-2xl">
          Accesorios
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
      <p className="text-center text-lg font-medium md:text-2xl">
        ¡No est&aacute;s autorizado a ver esta p&aacute;gina!
      </p>
    </Container>
  );
}
