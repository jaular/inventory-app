import type { UseFormReturnType } from "@mantine/form";
import type { UserProps } from "~/lib/types";
import { Button, Select, TextInput, Group } from "@mantine/core";

type DataProps = UserProps;

type Props = {
  form: UseFormReturnType<DataProps>;
  onSubmit: (user: UserProps) => Promise<void>;
  onReset: () => void;
  createState: boolean;
  updateUser: boolean;
};

const UserForm = ({
  form,
  onSubmit,
  onReset,
  createState,
  updateUser,
}: Props) => {
  return (
    <form
      className="space-y-8"
      onSubmit={form.onSubmit((values) => {
        onSubmit(values);
      })}
      autoComplete="off"
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {!createState && (
          <>
            <TextInput
              label="ID"
              disabled
              withAsterisk
              {...form.getInputProps("id")}
            />
            <TextInput
              label="Nombre"
              disabled
              withAsterisk
              {...form.getInputProps("name")}
            />
            <TextInput
              label="Email"
              disabled
              withAsterisk
              {...form.getInputProps("email")}
            />
          </>
        )}
        <Select
          label="Rol"
          data={["none", "user", "admin"]}
          withAsterisk
          {...form.getInputProps("role")}
        />
      </div>
      <Group>
        <Button type="submit" color="blue" disabled={updateUser}>
          Enviar
        </Button>
        <Button
          variant="default"
          onClick={() => {
            onReset();
          }}
        >
          Cancelar
        </Button>
      </Group>
    </form>
  );
};

export default UserForm;
