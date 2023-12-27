import type { AccProps } from "~/lib/types";
import type { MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
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
  isDataLoading: boolean;
};

const AccTrackingTableList = ({ data, isDataLoading }: Props) => {
  const columns = useMemo<MRT_ColumnDef<DataProps>[]>(
    () => [
      {
        accessorKey: "createdAt",
        header: "Fecha del cambio",
        maxSize: 150,
        Cell: ({ row }) => row.original.createdAt.toLocaleDateString(),
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
        accessorKey: "date",
        header: "Fecha de entrega",
        maxSize: 150,
        Cell: ({ row }) => row.original.date.toLocaleDateString(),
      },
    ],
    [],
  );

  const table = useMantineReactTable({
    columns,
    data,
    state: { isLoading: isDataLoading },
    enableDensityToggle: false,
    localization: localization,
    initialState: {
      columnVisibility: {
        n: false,
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
  });

  return (
    <>
      <MantineReactTable table={table} />
    </>
  );
};

export default AccTrackingTableList;
