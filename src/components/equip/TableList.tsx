import type { PostProps, UserSessionProps } from "~/lib/types";
import type { MRT_ColumnDef, MRT_Row } from "mantine-react-table";
import { useMemo, useState } from "react";
import Link from "next/link";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Modal, Group, ActionIcon, Button, Tooltip, Menu } from "@mantine/core";
import {
  IconTablePlus,
  IconPencil,
  IconTrash,
  IconTableExport,
  IconLayoutRows,
  IconTableRow,
  IconHistoryToggle,
} from "@tabler/icons-react";
import Includes from "~/components/Includes";
import { downloadExcel } from "~/utils/excelExport";
import { localization } from "~/lib/tableLocale";
import {
  brandData,
  officeData,
  rangeData,
  ramData,
  yesOrNoData,
  departmentData,
  conditionData,
} from "~/lib/data";
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
  isDataLoading: boolean;
  onUpdate: (post: PostProps) => void;
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

const TableList = ({
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
    downloadExcel(rowData, cols);
  };

  const handleExportData = () => {
    const visCols = table.getVisibleFlatColumns().map((col) => {
      const { header, id, size, minSize } = col.columnDef;
      return { id, header, size, minSize };
    });
    const cols = visCols.slice(1, visCols.length - 1) as ColsProps[];

    downloadExcel(data, cols);
  };

  const columns = useMemo<MRT_ColumnDef<DataProps>[]>(
    () => [
      {
        accessorKey: "n",
        header: "ID",
        maxSize: 130,
        // accessorFn: (row) => (
        //   <Anchor component={Link} href={`/post/${row.n}`}>
        //     {row.n}
        //   </Anchor>
        // ),
      },
      {
        accessorKey: "status",
        accessorFn: (row) => (row.status ? "En uso" : "Almacenado"),
        header: "Estado",
        maxSize: 110,
      },
      {
        accessorKey: "name",
        header: "Nombre",
        maxSize: 130,
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
        accessorKey: "range",
        header: "Gama",
        maxSize: 150,
        filterVariant: "multi-select",
        mantineFilterSelectProps: {
          data: rangeData,
        },
      },
      {
        accessorKey: "ram",
        header: "Memoria RAM",
        maxSize: 150,
        filterVariant: "multi-select",
        mantineFilterSelectProps: {
          data: ramData,
        },
      },
      {
        accessorKey: "mouse",
        accessorFn: (row) => (row.accessories.includes("Mouse") ? "Si" : "No"),
        header: "Mouse",
        maxSize: 130,
        filterVariant: "multi-select",
        mantineFilterSelectProps: {
          data: yesOrNoData,
        },
        Cell: ({ row }) => (
          <Includes value={row.original.accessories.includes("Mouse")} />
        ),
      },
      {
        accessorKey: "keyboard",
        accessorFn: (row) =>
          row.accessories.includes("Teclado") ? "Si" : "No",
        header: "Teclado",
        maxSize: 130,
        filterVariant: "multi-select",
        mantineFilterSelectProps: {
          data: yesOrNoData,
        },
        Cell: ({ row }) => (
          <Includes value={row.original.accessories.includes("Teclado")} />
        ),
      },
      {
        accessorKey: "monitor",
        accessorFn: (row) =>
          row.accessories.includes("Monitor") ? "Si" : "No",
        header: "Monitor",
        maxSize: 130,
        filterVariant: "multi-select",
        mantineFilterSelectProps: {
          data: yesOrNoData,
        },
        Cell: ({ row }) => (
          <Includes value={row.original.accessories.includes("Monitor")} />
        ),
      },
      {
        accessorKey: "charger",
        accessorFn: (row) =>
          row.accessories.includes("Cargador") ? "Si" : "No",
        header: "Cargador",
        maxSize: 130,
        filterVariant: "multi-select",
        mantineFilterSelectProps: {
          data: yesOrNoData,
        },
        Cell: ({ row }) => (
          <Includes value={row.original.accessories.includes("Cargador")} />
        ),
      },
      {
        accessorKey: "bag",
        accessorFn: (row) => (row.accessories.includes("Bolso") ? "Si" : "No"),
        header: "Bolso",
        maxSize: 130,
        filterVariant: "multi-select",
        mantineFilterSelectProps: {
          data: yesOrNoData,
        },
        Cell: ({ row }) => (
          <Includes value={row.original.accessories.includes("Bolso")} />
        ),
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
        accessorKey: "macE",
        header: "MAC (E)",
        maxSize: 130,
      },
      {
        accessorKey: "macW",
        header: "MAC (W)",
        maxSize: 130,
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
        filterVariant: "multi-select",
        mantineFilterSelectProps: {
          data: departmentData,
        },
      },
      {
        accessorKey: "management",
        header: "Gerencia",
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
        accessorKey: "orderNumber",
        header: "Número de orden",
        maxSize: 130,
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
        maxSize: 80,
        enableHiding: false,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ row }) => (
          <Menu position="right" withArrow>
            <Menu.Target>
              <Button variant="light" size="compact-sm">
                ...
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconPencil size={16} stroke={1.5} />}
                onClick={() => onUpdate(row.original)}
              >
                Actualizar
              </Menu.Item>
              <Menu.Item
                leftSection={<IconHistoryToggle size={16} stroke={1.5} />}
                component={Link}
                href={`/post/${row.original.n}`}
              >
                Historial
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<IconTrash size={16} stroke={1.5} />}
                disabled={row.original.createdBy?.name !== user.name}
                onClick={() => {
                  setDeleteModalOpened(true);
                  setDeviceId(row.original.n);
                }}
              >
                Eliminar
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
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
        range: false,
        ram: false,
        mouse: false,
        keyboard: false,
        monitor: false,
        charger: false,
        bag: false,
        condition: false,
        macE: false,
        macW: false,
        department: false,
        management: false,
        office: false,
        orderNumber: false,
        note: false,
        date: false,
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

export default TableList;
