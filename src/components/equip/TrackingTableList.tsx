import type { PostProps } from "~/lib/types";
import type { MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { localization } from "~/lib/tableLocale";
import {
  brandData,
  officeData,
  rangeData,
  ramData,
  departmentData,
} from "~/lib/data";

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
  isDataLoading: boolean;
};

const TrackingTableList = ({ data, isDataLoading }: Props) => {
  const columns = useMemo<MRT_ColumnDef<DataProps>[]>(
    () => [
      {
        accessorKey: "createdAt",
        accessorFn: (row) =>
          `${row.createdAt?.toLocaleDateString("es-VE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })} - ${row.createdAt?.toLocaleTimeString("en-US")}`,
        header: "Fecha del cambio",
        enableHiding: false,
        maxSize: 200,
      },
      {
        accessorFn: (row) => row.createdBy?.name,
        header: "Cambio hecho por",
        enableHiding: false,
        maxSize: 180,
      },
      {
        accessorKey: "n",
        header: "ID",
        maxSize: 130,
      },
      {
        accessorKey: "status",
        accessorFn: (row) => (row.status ? "En uso" : "Almacenado"),
        header: "Estado",
        maxSize: 130,
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
        accessorFn: (row) => (row.accessories?.[0] === "Mouse" ? "Si" : "No"),
        header: "Mouse",
        maxSize: 130,
      },
      {
        accessorKey: "bag",
        accessorFn: (row) => (row.accessories?.[1] === "Bolso" ? "Si" : "No"),
        header: "Bolso",
        maxSize: 130,
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
        maxSize: 160,
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
        maxSize: 160,
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
        modelName: false,
        range: false,
        ram: false,
        mouse: false,
        bag: false,
        macE: false,
        macW: false,
        department: false,
        management: false,
        office: false,
        orderNumber: false,
        note: false,
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
      <MantineReactTable table={table} />
    </>
  );
};

export default TrackingTableList;
