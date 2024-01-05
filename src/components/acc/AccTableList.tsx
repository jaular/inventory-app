import type { AccProps, UserSessionProps } from "~/lib/types";
import type { MRT_ColumnDef, MRT_Row } from "mantine-react-table";
import { useMemo, useState } from "react";
import Link from "next/link";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Modal, Group, ActionIcon, Button, Tooltip } from "@mantine/core";
import {
  IconTablePlus,
  IconPencil,
  IconTrash,
  IconTableExport,
  IconLayoutRows,
  IconTableRow,
  IconHistoryToggle,
} from "@tabler/icons-react";
import { downloadExcelAcc } from "~/utils/excelExport";
import { localization } from "~/lib/tableLocale";
import {
  typeData,
  brandData,
  conditionData,
  officeData,
  connectorData,
} from "~/lib/data";
import classes from "~/styles/table.module.css";

type DataProps = AccProps & {
  n: string;
  createdBy?: {
    name: string | null;
  };
};

type Props = {
  data: DataProps[];
  isDataLoading: boolean;
  onUpdate: (acc: AccProps) => void;
  onDelete: (serialNumber: string) => Promise<void>;
  FormModalOpened: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserSessionProps;
};

type ColsProps = {
  id: string;
  header: string;
  size: number;
  minSize: number;
};

const AccTableList = ({
  data,
  isDataLoading,
  onUpdate,
  onDelete,
  FormModalOpened,
  user,
}: Props) => {
  const [deviceId, setDeviceId] = useState("");
  const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false);

  const handleExportRows = (rows: MRT_Row<DataProps>[]) => {
    const visCols = table.getVisibleFlatColumns().map((col) => {
      const { header, id, size, minSize } = col.columnDef;
      return { id, header, size, minSize };
    });
    const cols = visCols.slice(1, visCols.length - 1) as ColsProps[];

    const rowData = rows.map((row) => row.original);
    downloadExcelAcc(rowData, cols);
  };

  const handleExportData = () => {
    const visCols = table.getVisibleFlatColumns().map((col) => {
      const { header, id, size, minSize } = col.columnDef;
      return { id, header, size, minSize };
    });
    const cols = visCols.slice(1, visCols.length - 1) as ColsProps[];

    downloadExcelAcc(data, cols);
  };

  const columns = useMemo<MRT_ColumnDef<DataProps>[]>(
    () => [
      {
        accessorKey: "n",
        header: "ID",
        maxSize: 130,
      },
      {
        accessorKey: "status",
        accessorFn: (row) => (row.status ? "En uso" : "Almacenado"),
        header: "Estado",
        maxSize: 110,
      },
      {
        accessorKey: "type",
        header: "Tipo",
        maxSize: 120,
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
        maxSize: 120,
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
        header: "Condición",
        maxSize: 140,
        filterVariant: "multi-select",
        mantineFilterSelectProps: {
          data: conditionData,
        },
      },
      {
        accessorKey: "connector",
        header: "Conector",
        maxSize: 130,
        filterVariant: "multi-select",
        mantineFilterSelectProps: {
          data: connectorData,
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
        maxSize: 130,
      },
      {
        accessorKey: "office",
        header: "Sede",
        maxSize: 130,
        filterVariant: "multi-select",
        mantineFilterSelectProps: {
          data: officeData,
        },
      },
      {
        accessorKey: "note",
        header: "Observaciones",
        maxSize: 160,
      },
      {
        accessorKey: "date",
        accessorFn: (row) =>
          row.date?.toLocaleDateString("es-VE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        header: "Fecha de entrega",
        maxSize: 150,
      },
      {
        header: " ",
        enableHiding: false,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ row }) => (
          <Group>
            <Tooltip label="Actualizar" color="gray" offset={10}>
              <ActionIcon
                size={32}
                variant="light"
                aria-label="Actualizar"
                onClick={() => onUpdate(row.original)}
              >
                <IconPencil size={18} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Eliminar" color="gray" offset={10}>
              <ActionIcon
                size={32}
                variant="light"
                color="red"
                aria-label="Eliminar"
                disabled={row.original.createdBy?.name !== user.name}
                onClick={() => {
                  setDeleteModalOpened(true);
                  setDeviceId(row.original.n);
                }}
              >
                <IconTrash size={18} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Historial" color="gray" offset={10}>
              <ActionIcon
                size={32}
                variant="light"
                color="gray"
                aria-label="Historial"
                component={Link}
                href={`/acc/${row.original.n}`}
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
    state: { isLoading: isDataLoading },
    enableRowSelection: true,
    enableDensityToggle: false,
    localization: localization,
    initialState: {
      columnVisibility: {
        n: false,
        status: false,
        modelName: false,
        department: false,
        condition: false,
        connector: false,
        office: false,
        note: false,
      },
      pagination: { pageSize: 10, pageIndex: 0 },
      density: "xs",
    },
    // paginationDisplayMode: "pages",
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
    mantineLoadingOverlayProps: {
      loaderProps: {
        style: {
          display: "none",
        },
      },
    },
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

      <div className="my-4 flex items-center justify-between">
        <Tooltip label="Nuevo" color="gray" offset={10}>
          <ActionIcon
            size="lg"
            variant="light"
            aria-label="Nuevo"
            onClick={() => FormModalOpened(true)}
          >
            <IconTablePlus
              style={{ width: "70%", height: "70%" }}
              stroke={1.5}
            />
          </ActionIcon>
        </Tooltip>

        <ActionIcon.Group>
          <Tooltip label="Exportar todo" color="gray" offset={10}>
            <ActionIcon
              size="lg"
              variant="light"
              color="teal"
              aria-label="Exportar todo"
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
              aria-label="Exportar todas las filas"
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
          <Tooltip
            label="Exportar filas seleccionadas"
            color="gray"
            offset={10}
          >
            <ActionIcon
              size="lg"
              variant="light"
              color="teal"
              aria-label="Exportar filas seleccionadas"
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
      </div>
      <MantineReactTable table={table} />
    </>
  );
};

export default AccTableList;
