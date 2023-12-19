import type { UserProps } from "~/lib/types";
import { useState, useEffect } from "react";
import {
  Table,
  ScrollArea,
  Group,
  ActionIcon,
  UnstyledButton,
  Text,
  Center,
  TextInput,
} from "@mantine/core";
import {
  IconPencil,
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from "@tabler/icons-react";
import cx from "clsx";
import classes from "~/styles/table.module.css";

type DataProps = UserProps & {
  id: string;
};

type Props = {
  data: DataProps[];
  onUpdate: (user: UserProps) => void;
};

type ThProps = {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
};

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: DataProps[], search: string) {
  const query = search.toLowerCase().trim();

  return data.filter(
    (item) =>
      item.id.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.role.toLowerCase().includes(query),
  );
}

function sortData(
  data: DataProps[],
  payload: {
    sortBy: keyof UserProps | null;
    reversed: boolean;
    search: string;
  },
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search,
  );
}

const UserTableList = ({ data, onUpdate }: Props) => {
  const [deviceId, setDeviceId] = useState("");
  const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof UserProps | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  const setSorting = (field: keyof UserProps) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value }),
    );
  };

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.email}</Table.Td>
      <Table.Td>{row.role}</Table.Td>
      <Table.Td>
        <Group>
          <ActionIcon
            color="gray"
            size={32}
            variant="light"
            onClick={() => onUpdate(row)}
          >
            <IconPencil size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <TextInput
        className="md:max-w-xs"
        placeholder=" -- buscar -- "
        leftSection={<IconSearch size={14} stroke={1.5} />}
        value={search}
        autoComplete="off"
        onChange={handleSearchChange}
      />

      <ScrollArea
        className="mt-8"
        style={{ height: 254 }}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table
          highlightOnHover
          horizontalSpacing="md"
          verticalSpacing="xs"
          miw={700}
          layout="fixed"
        >
          <Table.Thead
            className={cx(classes.header, {
              [classes.scrolled || ""]: scrolled,
            })}
          >
            <Table.Tr>
              <Th
                sorted={sortBy === "name"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("name")}
              >
                Nombre
              </Th>
              <Th
                sorted={sortBy === "email"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("email")}
              >
                Email
              </Th>
              <Th
                sorted={sortBy === "role"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("role")}
              >
                Rol
              </Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text fw={500} ta="center">
                    Nada encontrado
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </>
  );
};

export default UserTableList;
