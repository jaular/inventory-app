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
  Chip,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  brandData,
  rangeData,
  ramData,
  conditionData,
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
  const isLoading = createPost || updatePost;
  const customDisable = isLoading ? true : !form.isDirty();

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
        <div className="col-span-2 md:col-span-3 xl:col-span-4">
          <Chip
            radius="sm"
            variant="light"
            {...form.getInputProps("status", { type: "checkbox" })}
          >
            En uso
          </Chip>
        </div>
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
        <TextInput label="Serial" {...form.getInputProps("serialNumber")} />
        <Select
          label="Marca"
          data={brandData}
          searchable
          allowDeselect={false}
          {...form.getInputProps("brand")}
        />
        <TextInput label="Modelo" {...form.getInputProps("modelName")} />
        <TextInput label="Nombre del equipo" {...form.getInputProps("name")} />
        <Select
          label="Gama"
          data={rangeData}
          searchable
          allowDeselect={false}
          {...form.getInputProps("range")}
        />
        <Select
          label="Memoria RAM"
          data={ramData}
          searchable
          allowDeselect={false}
          {...form.getInputProps("ram")}
        />
        <Select
          label="Condici&oacute;n"
          data={conditionData}
          searchable
          allowDeselect={false}
          withAsterisk
          {...form.getInputProps("condition")}
        />
        <TextInput
          label="Direcci&oacute;n MAC (E)"
          {...form.getInputProps("macE")}
        />
        <TextInput
          label="Direcci&oacute;n MAC (W)"
          {...form.getInputProps("macW")}
        />
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
          label="INFORMACI&Oacute;N ADICIONAL"
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
          allowDeselect={false}
          {...form.getInputProps("department")}
        />
        <TextInput label="Gerencia" {...form.getInputProps("management")} />
        <Select
          label="Sede"
          data={officeData}
          searchable
          allowDeselect={false}
          withAsterisk
          {...form.getInputProps("office")}
        />
        <DatePickerInput
          locale="es"
          label="Fecha de entrega"
          valueFormat="DD/MM/YYYY"
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
