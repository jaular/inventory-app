import type { UserProps } from "~/lib/types";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Modal } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { api } from "~/utils/api";
import { userSchema } from "~/lib/schema";
import { userInitialValues } from "~/lib/data";
import UserForm from "~/components/UserForm";
import UserTableList from "~/components/UserTableList";
import Container from "~/components/Container";
import classes from "~/styles/modal.module.css";

type DataProps = UserProps & {
  id: string;
};

export default function UserPage() {
  const [formModalOpened, setFormModalOpened] = useState<boolean>(false);
  const [createState, setCreateState] = useState<boolean>(true);

  const { data: sessionData } = useSession();

  const utils = api.useUtils();
  const { data, isSuccess } = api.user.getAll.useQuery();
  const userData = data as DataProps[];

  const updateUser = api.user.update.useMutation({
    async onSuccess() {
      await utils.user.getAll.invalidate();
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

  if (sessionData?.user.role === "admin") {
    return (
      <Container title="Management">
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

        <div className="mx-auto mt-16 w-full max-w-5xl px-4 sm:px-6 md:mt-24 lg:px-8">
          <UserTableList
            data={isSuccess ? userData : []}
            onUpdate={handleUpdate}
          />
        </div>
      </Container>
    );
  }

  return (
    <Container title="Management">
      <div className="text-center">
        <p>You are not authorized to view this page!</p>
      </div>
    </Container>
  );
}
