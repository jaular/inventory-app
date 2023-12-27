import type { UserProps } from "~/lib/types";
import type { MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Group, ActionIcon, Tooltip } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { localization } from "~/lib/tableLocale";

type DataProps = UserProps & {
  id: string;
};

type Props = {
  data: DataProps[];
  isDataLoading: boolean;
  onUpdate: (user: UserProps) => void;
};

const UserTableList = ({ data, isDataLoading, onUpdate }: Props) => {
  const columns = useMemo<MRT_ColumnDef<DataProps>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        maxSize: 130,
      },
      {
        accessorKey: "name",
        header: "Nombre",
        maxSize: 150,
      },
      {
        accessorKey: "email",
        header: "Email",
        maxSize: 150,
      },
      {
        accessorKey: "role",
        header: "Rol",
        maxSize: 150,
        filterVariant: "multi-select",
        mantineFilterSelectProps: {
          data: ["admin", "user", "none"],
        },
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
    enableDensityToggle: false,
    localization: localization,
    initialState: {
      columnVisibility: {
        id: false,
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

export default UserTableList;
