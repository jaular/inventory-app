import type { PostProps } from "~/lib/types";
import { useMemo, useState } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "mantine-react-table";
import { Modal, Group, ActionIcon, Button, Tooltip } from "@mantine/core";
import {
  IconPencil,
  IconTrash,
  IconTableExport,
  IconTableRow,
} from "@tabler/icons-react";
import { downloadExcel } from "~/utils/excelExport";
import { localization } from "~/lib/tableLocale";
import classes from "~/styles/table.module.css";

type DataProps = PostProps & {
  n: string;
  accessories: any; // string[]
  createdBy?: {
    name: string | null;
  };
};

type Props = {
  data: DataProps[];
  onUpdate: (post: PostProps) => void;
  onDelete: (serialNumber: string) => Promise<void>;
};

const TableList = ({ data, onUpdate, onDelete }: Props) => {
  const [deviceId, setDeviceId] = useState("");
  const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false);

  const handleExportRows = (rows: MRT_Row<DataProps>[]) => {
    const rowData = rows.map((row) => row.original);
    downloadExcel(rowData);
  };

  const handleExportData = () => {
    downloadExcel(data);
  };

  const columns = useMemo<MRT_ColumnDef<DataProps>[]>(
    () => [
      {
        accessorKey: "n",
        header: "ID",
        size: 10,
      },
      {
        accessorKey: "name",
        header: "Nombre",
        size: 10,
      },
      {
        accessorKey: "serialNumber",
        header: "S/N",
        size: 10,
      },
      {
        accessorKey: "brand",
        header: "Marca",
        size: 10,
      },
      {
        accessorKey: "modelName",
        header: "Modelo",
        size: 10,
      },
      {
        accessorKey: "userName",
        header: "Usuario",
        size: 10,
      },
      {
        accessorKey: "office",
        header: "Sede",
        size: 10,
      },
      {
        accessorFn: (row) => row.date.toLocaleDateString(),
        header: "Fecha",
        size: 10,
      },
      {
        header: "...",
        accessorFn: (row) => (
          <Group>
            <Tooltip label="Actualizar" color="gray" offset={10}>
              <ActionIcon
                size={32}
                variant="light"
                color="gray"
                onClick={() => onUpdate(row)}
              >
                <IconPencil size={18} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Eliminar" color="gray" offset={10}>
              <ActionIcon
                size={32}
                variant="light"
                color="red"
                onClick={() => {
                  setDeleteModalOpened(true);
                  setDeviceId(row.n);
                }}
              >
                <IconTrash size={18} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>
        ),
      },
    ],
    [],
  );

  const table = useMantineReactTable({
    columns,
    data,
    enableRowSelection: true,
    enableDensityToggle: false,
    localization: localization,
    initialState: {
      columnVisibility: {
        n: false,
        modelName: false,
        office: false,
      },
      pagination: { pageSize: 5, pageIndex: 0 },
    },
    paginationDisplayMode: "pages",
    mantinePaginationProps: {
      showRowsPerPage: false,
      rowsPerPageOptions: ["5", "10"],
    },
    // renderTopToolbarCustomActions: ({ table }) => (),
  });

  return (
    <>
      <Modal
        className={classes.modal}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        opened={deleteModalOpened}
        centered
        onClose={() => setDeleteModalOpened(false)}
        title="Eliminar"
      >
        <p>
          ¿Estás seguro de que quieres eliminar este elemento:{" "}
          <strong>{deviceId}</strong>?
        </p>
        <Group pt="lg">
          <Button
            color="red"
            onClick={() => {
              onDelete(deviceId);
              setDeleteModalOpened(false);
            }}
          >
            Si, eliminar
          </Button>
          <Button
            variant="default"
            onClick={() => {
              setDeleteModalOpened(false);
            }}
          >
            Cancelar
          </Button>
        </Group>
      </Modal>

      <ActionIcon.Group className="my-4">
        <Tooltip label="Exportar todo" color="gray" offset={10}>
          <ActionIcon
            size={32}
            variant="light"
            color="teal"
            onClick={handleExportData}
          >
            <IconTableExport
              style={{ width: "70%", height: "70%" }}
              stroke={1.5}
            />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Exportar filas seleccionadas" color="gray" offset={10}>
          <ActionIcon
            size={32}
            variant="light"
            color="teal"
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          >
            <IconTableRow
              style={{ width: "70%", height: "70%" }}
              stroke={1.5}
            />
          </ActionIcon>
        </Tooltip>
      </ActionIcon.Group>
      <MantineReactTable table={table} />
    </>
  );
};

export default TableList;
