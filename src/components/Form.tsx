import type { UseFormReturnType } from "@mantine/form";
import type { PostProps } from "~/lib/types";
import {
  Button,
  Select,
  TextInput,
  Group,
  Divider,
  Checkbox,
  Textarea,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  brandData,
  rangeData,
  ramData,
  departmentData,
  officeData,
} from "~/lib/data";
import "dayjs/locale/es";

type DataProps = PostProps & {
  createdBy?: {
    name: string | null;
  };
};

type Props = {
  form: UseFormReturnType<DataProps>;
  onSubmit: (post: PostProps) => Promise<void>;
  onReset: () => void;
  createState: boolean;
  createPost: boolean;
  updatePost: boolean;
};

const Form = ({
  form,
  onSubmit,
  onReset,
  createState,
  createPost,
  updatePost,
}: Props) => {
  return (
    <form
      className="space-y-8"
      onSubmit={form.onSubmit((values) => {
        // form.setValues({
        //   id: null as any,
        // });

        // form.setValues({
        //   n: randomId(),
        // });
        // console.log(values);
        onSubmit(values);
      })}
      autoComplete="off"
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
        {!createState && (
          <>
            <TextInput
              label="ID"
              disabled
              withAsterisk
              {...form.getInputProps("n")}
            />
            <TextInput
              label="Creado por"
              disabled
              withAsterisk
              {...form.getInputProps("createdBy.name")}
            />
          </>
        )}
        <TextInput label="Serial" {...form.getInputProps("serialNumber")} />
        <Select
          label="Marca"
          data={brandData}
          searchable
          {...form.getInputProps("brand")}
        />
        <TextInput label="Modelo" {...form.getInputProps("modelName")} />
        <TextInput label="Nombre del equipo" {...form.getInputProps("name")} />
        <Select
          label="Gama"
          data={rangeData}
          searchable
          {...form.getInputProps("range")}
        />
        <Select
          label="Memoria RAM"
          data={ramData}
          searchable
          {...form.getInputProps("ram")}
        />
        {/* <TextInput label="Dirección MAC (E)" {...form.getInputProps("macE")} /> */}
        <Checkbox.Group
          className="col-span-2 md:col-span-3 xl:col-span-4"
          label="Accesorios"
          {...form.getInputProps("accessories")}
        >
          <div className="flex space-x-5">
            <Checkbox value="Mouse" label="Mouse" />
            <Checkbox value="Bolso" label="Bolso" />
          </div>
        </Checkbox.Group>

        <Divider
          my="md"
          label="Responsable"
          labelPosition="center"
          className="col-span-2 md:col-span-3 xl:col-span-4"
        />

        <TextInput
          label="Nombre del usuario"
          {...form.getInputProps("userName")}
        />
        <Select
          label="Dirección"
          data={departmentData}
          searchable
          {...form.getInputProps("department")}
        />
        <TextInput label="Gerencia" {...form.getInputProps("management")} />
        <Select
          label="Sede"
          data={officeData}
          searchable
          {...form.getInputProps("office")}
        />

        <Divider
          my="md"
          label="Informaci&oacute;n adicional"
          labelPosition="center"
          className="col-span-2 md:col-span-3 xl:col-span-4"
        />
        <DatePickerInput
          locale="es"
          label="Fecha de entrega"
          defaultValue={new Date()}
          {...form.getInputProps("date")}
        />
        <TextInput
          label="N&uacute;mero de orden"
          {...form.getInputProps("orderNumber")}
        />
        <Textarea
          className="col-span-2 max-w-lg md:col-span-3"
          label="Observaciones"
          autosize
          minRows={3}
          {...form.getInputProps("note")}
        />
      </div>
      <Group>
        <Button type="submit" color="blue" disabled={createPost || updatePost}>
          Enviar
        </Button>
        <Button
          variant="default"
          disabled={createPost || updatePost}
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

export default Form;
