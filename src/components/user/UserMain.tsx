import type { UserProps } from "~/lib/types";
import { useState } from "react";
import { Modal } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { api } from "~/utils/api";
import { userSchema } from "~/lib/schema";
import { userInitialValues } from "~/lib/data";
import UserForm from "~/components/user/UserForm";
import UserTableList from "~/components/user/UserTableList";
import classes from "~/styles/modal.module.css";

type DataProps = UserProps & {
  id: string;
};

export default function UserMain() {
  const [formModalOpened, setFormModalOpened] = useState<boolean>(false);
  const [createState, setCreateState] = useState<boolean>(true);

  const utils = api.useUtils();
  const { data, isSuccess, isLoading } = api.user.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const userData = data as DataProps[];

  const updateUser = api.user.update.useMutation({
    async onSuccess() {
      await utils.user.getAll.invalidate();
      notifications.show({
        message: "Usuario actualizado",
      });
    },
  });

  const form = useForm({
    validate: zodResolver(userSchema),
    initialValues: userInitialValues,
    transformValues: (values) => ({
      ...values,
    }),
  });

  const handleReset = () => {
    form.reset();
    setCreateState(true);
    setFormModalOpened(false);
  };

  const handleSubmit = async (user: UserProps) => {
    try {
      await updateUser.mutateAsync(user);
      handleReset();
    } catch {}
  };

  const handleUpdate = (user: UserProps) => {
    Object.entries(user).forEach(([key, value]) => {
      form.setFieldValue(key, value);
    });
    setCreateState(false);
    setFormModalOpened(true);
  };

  const modelWidth = useMediaQuery("(max-width: 1200px)") ? "100%" : "85%";

  return (
    <>
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
        <UserForm
          form={form}
          createState={createState}
          updateUser={updateUser.isLoading}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />
      </Modal>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold md:text-3xl">
          Gesti&oacute;n de usuarios
        </h1>
      </div>

      <div className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <UserTableList
          data={isSuccess ? userData : []}
          onUpdate={handleUpdate}
          isDataLoading={isLoading}
        />
      </div>
    </>
  );
}
