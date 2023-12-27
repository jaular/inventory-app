import type { PostProps } from "~/lib/types";
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
import { downloadExcel } from "~/utils/excelExport";
import { localization } from "~/lib/tableLocale";
import { brandData, officeData, rangeData, ramData } from "~/lib/data";
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
};

const TableList = ({
  data,
  isDataLoading,
  onUpdate,
  onDelete,
  FormModalOpened,
}: Props) => {
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
        maxSize: 130,
        // accessorFn: (row) => (
        //   <Anchor component={Link} href={`/post/${row.n}`}>
        //     {row.n}
        //   </Anchor>
        // ),
      },
      {
        accessorKey: "name",
        header: "Nombre",
        maxSize: 150,
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
        header: "Mouse",
        maxSize: 130,
        Cell: ({ row }) =>
          row.original.accessories[0] === "Mouse" ? "Si" : "No",
      },
      {
        accessorKey: "bag",
        header: "Bolso",
        maxSize: 130,
        Cell: ({ row }) =>
          row.original.accessories[1] === "Bolso" ? "Si" : "No",
      },
      {
        accessorKey: "userName",
        header: "Usuario",
        maxSize: 130,
      },
      {
        accessorKey: "office",
        header: "Sede",
        maxSize: 160,
        filterVariant: "multi-select",
        mantineFilterSelectProps: {
          data: officeData,
        },
      },
      {
        accessorKey: "date",
        header: "Fecha de entrega",
        maxSize: 150,
        Cell: ({ row }) => row.original.date.toLocaleDateString(),
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
                aria-label="Elimanar"
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
                href={`/post/${row.original.n}`}
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
        modelName: false,
        range: false,
        ram: false,
        mouse: false,
        bag: false,
        office: false,
      },
      pagination: { pageSize: 5, pageIndex: 0 },
      density: "xs",
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
