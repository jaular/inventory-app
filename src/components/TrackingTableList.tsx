import type { PostProps } from "~/lib/types";
import type { MRT_ColumnDef, MRT_Row } from "mantine-react-table";
import { useMemo } from "react";
import Link from "next/link";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { ActionIcon, Tooltip, Anchor } from "@mantine/core";
import {
  IconTableExport,
  IconLayoutRows,
  IconTableRow,
} from "@tabler/icons-react";
import { downloadExcel } from "~/utils/excelExport";
import { localization } from "~/lib/tableLocale";
import { brandData, officeData } from "~/lib/data";

type DataProps = PostProps & {
  n: string;
  createdAt: Date;
  accessories: any; // string[]
  createdBy?: {
    name: string | null;
  };
};

type Props = {
  data: DataProps[];
};

const TrackingTableList = ({ data }: Props) => {
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
        accessorFn: (row) => row.createdAt.toLocaleDateString(),
        header: "Fecha del cambio",
        maxSize: 150,
      },
      {
        accessorFn: (row) => row.createdBy?.name,
        header: "Cambio hecho por",
        maxSize: 180,
      },
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
        header: "Game",
        maxSize: 150,
      },
      {
        accessorKey: "ram",
        header: "Memoria RAM",
        maxSize: 150,
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
        accessorKey: "orderNumber",
        header: "Numero de orden",
        maxSize: 150,
      },
      {
        accessorFn: (row) => row.date.toLocaleDateString(),
        header: "Fecha de entrega",
        maxSize: 150,
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
      {/* <ActionIcon.Group className="my-4">
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
      </ActionIcon.Group> */}
      <MantineReactTable table={table} />
    </>
  );
};

export default TrackingTableList;
