import type { UseFormReturnType } from "@mantine/form";
import type { AccProps } from "~/lib/types";
import {
  Button,
  Select,
  TextInput,
  Group,
  Divider,
  Textarea,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { typeData, brandData, conditionData, departmentData } from "~/lib/data";
import "dayjs/locale/es";

type DataProps = AccProps & {
  createdBy?: {
    name: string | null;
  };
};

type Props = {
  form: UseFormReturnType<DataProps>;
  onSubmit: (acc: AccProps) => Promise<void>;
  onReset: () => void;
  createState: boolean;
  createAcc: boolean;
  updateAcc: boolean;
};

const AccForm = ({
  form,
  onSubmit,
  onReset,
  createState,
  createAcc,
  updateAcc,
}: Props) => {
  const isLoading = createAcc || updateAcc;
  const customDisable = isLoading ? true : !form.isDirty();

  return (
    <form
      className="space-y-8"
      onSubmit={form.onSubmit((values) => {
        onSubmit(values);
      })}
      autoComplete="off"
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
        {!createState && (
          <>
            <TextInput
              label="ID"
              readOnly
              withAsterisk
              {...form.getInputProps("n")}
            />
            <TextInput
              label="Creado por"
              readOnly
              withAsterisk
              {...form.getInputProps("createdBy.name")}
            />
          </>
        )}
        <Select
          label="Tipo"
          data={typeData}
          searchable
          withAsterisk
          {...form.getInputProps("type")}
        />
        <TextInput label="Serial" {...form.getInputProps("serialNumber")} />
        <Select
          label="Marca"
          data={brandData}
          searchable
          {...form.getInputProps("brand")}
        />
        <TextInput label="Modelo" {...form.getInputProps("modelName")} />
        <Select
          label="Estado"
          data={conditionData}
          searchable
          withAsterisk
          {...form.getInputProps("condition")}
        />

        <Divider
          my="md"
          label="RESPONSABLE"
          labelPosition="center"
          className="col-span-2 md:col-span-3 xl:col-span-4"
        />

        <TextInput
          label="Nombre del usuario"
          {...form.getInputProps("userName")}
        />
        <Select
          label="Direcci&oacute;n"
          data={departmentData}
          searchable
          {...form.getInputProps("department")}
        />

        <Divider
          my="md"
          label="INFORMACI&Oacute;N ADICIONAL"
          labelPosition="center"
          className="col-span-2 md:col-span-3 xl:col-span-4"
        />
        <DatePickerInput
          locale="es"
          label="Fecha de entrega"
          defaultValue={new Date()}
          {...form.getInputProps("date")}
        />
        <div></div>
        <Textarea
          className="col-span-2 max-w-lg md:col-span-3"
          label="Observaciones"
          autosize
          minRows={3}
          {...form.getInputProps("note")}
        />
      </div>
      <Group>
        {createState ? (
          <Button type="submit" color="blue" disabled={isLoading}>
            Enviar
          </Button>
        ) : (
          <Button type="submit" color="blue" disabled={customDisable}>
            Enviar
          </Button>
        )}
        <Button
          variant="default"
          disabled={createAcc || updateAcc}
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

export default AccForm;