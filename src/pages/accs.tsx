import type { AccProps } from "~/lib/types";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Modal, Loader } from "@mantine/core";
// import { useMediaQuery } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { api } from "~/utils/api";
import { accSchema } from "~/lib/schema";
import { accInitialValues } from "~/lib/data";
import Container from "~/components/Container";
import AccForm from "~/components/acc/AccForm";
import AccTableList from "~/components/acc/AccTableList";
import classes from "~/styles/modal.module.css";

export default function AccPage() {
  const [formModalOpened, setFormModalOpened] = useState<boolean>(false);
  const [createState, setCreateState] = useState<boolean>(true);

  const { data: sessionData, status } = useSession();

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
    form.setInitialValues(accInitialValues);
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
    form.setInitialValues(acc);
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

  if (status === "loading") {
    return (
      <Container title="Inventario (Accesorios)">
        <div className="flex min-h-[65vh] items-center justify-center">
          <Loader color="blue" size="lg" />
        </div>
      </Container>
    );
  }

  if (status === "authenticated" && sessionData?.user.role !== "none") {
    return (
      <Container title="Inventario (Accesorios)">
        <Modal
          fullScreen
          className={classes.modal}
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

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold md:text-3xl">
            Inventario de Accesorios
          </h1>
        </div>

        <div className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <AccTableList
            data={isSuccess ? data : []}
            dataIsLoading={isLoading}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            FormModalOpened={setFormModalOpened}
          />
        </div>
      </Container>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Container title="Inventario (Accesorios)">
        <div className="flex min-h-[65vh] items-center justify-center">
          <p className="text-lg font-medium md:text-2xl">
            ¡No est&aacute;s autorizado a ver esta p&aacute;gina!
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container title="Inventario (Accesorios)">
      <div className="flex min-h-[65vh] items-center justify-center">
        <p className="text-lg font-medium md:text-2xl">
          ¡No est&aacute;s autorizado a ver esta p&aacute;gina!
        </p>
      </div>
    </Container>
  );
}
