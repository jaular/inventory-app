import type { AccProps } from "~/lib/types";
import type { MRT_ColumnDef, MRT_Row } from "mantine-react-table";
import { useMemo, useState } from "react";
import Link from "next/link";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Modal, Group, ActionIcon, Button, Tooltip } from "@mantine/core";
import {
  IconPencil,
  IconTrash,
  IconTableExport,
  IconLayoutRows,
  IconTableRow,
  IconHistoryToggle,
} from "@tabler/icons-react";
import { downloadExcelAcc } from "~/utils/excelExport";
import { localization } from "~/lib/tableLocale";
import { typeData, brandData, conditionData } from "~/lib/data";
import classes from "~/styles/table.module.css";

type DataProps = AccProps & {
  n: string;
  createdBy?: {
    name: string | null;
  };
};

type Props = {
  data: DataProps[];
  onUpdate: (Post: AccProps) => void;
  onDelete: (serialNumber: string) => Promise<void>;
};

const AccTableList = ({ data, onUpdate, onDelete }: Props) => {
  const [deviceId, setDeviceId] = useState("");
  const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false);

  const handleExportRows = (rows: MRT_Row<DataProps>[]) => {
    const rowData = rows.map((row) => row.original);
    downloadExcelAcc(rowData);
  };

  const handleExportData = () => {
    downloadExcelAcc(data);
  };

  const columns = useMemo<MRT_ColumnDef<DataProps>[]>(
    () => [
      {
        accessorKey: "n",
        header: "ID",
        maxSize: 130,
      },
      {
        accessorKey: "type",
        header: "Tipo",
        maxSize: 140,
        filterVariant: "multi-select",
        mantineFilterSelectProps: {
          data: typeData,
        },
      },
      {
        accessorKey: "serialNumber",
        header: "S/N",
        maxSize: 130,
      },
      {
        accessorKey: "brand",
        header: "Marca",
        maxSize: 150,
        filterVariant: "multi-select",
        mantineFilterSelectProps: {
          data: brandData,
        },
      },
      {
        accessorKey: "modelName",
        header: "Modelo",
        maxSize: 130,
      },
      {
        accessorKey: "condition",
        header: "Estado",
        maxSize: 140,
        filterVariant: "multi-select",
        mantineFilterSelectProps: {
          data: conditionData,
        },
      },
      {
        accessorKey: "userName",
        header: "Usuario",
        maxSize: 130,
      },
      {
        accessorKey: "department",
        header: "Dirección",
        maxSize: 180,
      },
      {
        accessorFn: (row) => row.date.toLocaleDateString(),
        header: "Fecha de entrega",
        maxSize: 150,
      },
      {
        header: "...",
        enableSorting: false,
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
            <Tooltip label="Historial" color="gray" offset={10}>
              <ActionIcon
                size={32}
                variant="light"
                component={Link}
                href={`/acc/${row.n}`}
              >
                <IconHistoryToggle size={18} stroke={1.5} />
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
        department: false,
      },
      pagination: { pageSize: 5, pageIndex: 0 },
    },
    paginationDisplayMode: "pages",
    mantineTableProps: {
      style: {
        tableLayout: "fixed",
      },
    },
    mantinePaginationProps: {
      showRowsPerPage: false,
      rowsPerPageOptions: ["5", "10"],
      size: "sm",
    },
    mantineSelectCheckboxProps: {
      size: "sm",
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
            size="lg"
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
        <Tooltip label="Exportar todas las filas" color="gray" offset={10}>
          <ActionIcon
            size="lg"
            variant="light"
            color="teal"
            disabled={table.getPrePaginationRowModel().rows.length === 0}
            onClick={() =>
              handleExportRows(table.getPrePaginationRowModel().rows)
            }
          >
            <IconLayoutRows
              style={{ width: "70%", height: "70%" }}
              stroke={1.5}
            />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Exportar filas seleccionadas" color="gray" offset={10}>
          <ActionIcon
            size="lg"
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

export default AccTableList;
