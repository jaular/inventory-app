import type { AccProps } from "~/lib/types";
import type { MRT_ColumnDef, MRT_Row } from "mantine-react-table";
import { useMemo } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
// import { ActionIcon, Tooltip } from "@mantine/core";
// import {
//   IconTableExport,
//   IconLayoutRows,
//   IconTableRow,
// } from "@tabler/icons-react";
// import { downloadExcelAcc } from "~/utils/excelExport";
import { localization } from "~/lib/tableLocale";
import { typeData, brandData, conditionData } from "~/lib/data";

type DataProps = AccProps & {
  n: string;
  createdAt: Date;
  createdBy?: {
    name: string | null;
  };
};

type Props = {
  data: DataProps[];
};

const AccTrackingTableList = ({ data }: Props) => {
  // const handleExportRows = (rows: MRT_Row<DataProps>[]) => {
  //   const rowData = rows.map((row) => row.original);
  //   downloadExcelAcc(rowData);
  // };

  // const handleExportData = () => {
  //   downloadExcelAcc(data);
  // };

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
        maxSize: 150,
      },
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
    ],
    [],
  );

  const table = useMantineReactTable({
    columns,
    data,
    // enableRowSelection: true,
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

export default AccTrackingTableList;
