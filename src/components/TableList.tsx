import type { PostProps } from "~/lib/types";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useMediaQuery } from "@mantine/hooks";
import {
  Table,
  Modal,
  ScrollArea,
  Group,
  ActionIcon,
  Anchor,
  UnstyledButton,
  Text,
  Center,
  TextInput,
  Button,
  Tooltip,
} from "@mantine/core";
import {
  IconPencil,
  IconTrash,
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconTableExport,
} from "@tabler/icons-react";
import cx from "clsx";
import { downloadExcel } from "~/utils/excelExport";
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
  onUpdate: (Post: PostProps) => void;
  onDelete: (serialNumber: string) => Promise<void>;
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
      item.n.toLowerCase().includes(query) ||
      item.serialNumber.toLowerCase().includes(query) ||
      item.brand.toLowerCase().includes(query) ||
      item.modelName.toLowerCase().includes(query) ||
      item.office.toLowerCase().includes(query) ||
      item.userName.toLowerCase().includes(query) ||
      item.date.toLocaleDateString().includes(query),
  );
}

function sortData(
  data: DataProps[],
  payload: {
    sortBy: keyof PostProps | null;
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

const TableList = ({ data, onUpdate, onDelete }: Props) => {
  const [deviceId, setDeviceId] = useState("");
  const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof PostProps | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  const setSorting = (field: keyof PostProps) => {
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

  const tableMinWidth = useMediaQuery("(max-width: 400px)")
    ? "1280px"
    : "1000px";

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.n}>
      <Table.Td className="truncate">
        <Anchor component={Link} href={`/post/${row.n}`}>
          {row.n}
        </Anchor>
      </Table.Td>
      <Table.Td className="truncate">{row.serialNumber}</Table.Td>
      <Table.Td className="truncate">{row.brand}</Table.Td>
      <Table.Td className="truncate">{row.modelName}</Table.Td>
      <Table.Td className="truncate">{row.userName}</Table.Td>
      <Table.Td className="truncate">{row.office}</Table.Td>
      <Table.Td className="truncate">{row.date.toLocaleDateString()}</Table.Td>
      {/* <Table.Td className="truncate">{row.createdBy?.name}</Table.Td> */}
      <Table.Td>
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
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

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

      <div className="flex items-center justify-between">
        <TextInput
          className="w-64"
          placeholder="Buscar"
          leftSection={<IconSearch size={14} stroke={1.5} />}
          value={search}
          autoComplete="off"
          onChange={handleSearchChange}
        />

        <Tooltip label="Exportar hoja de cálculo" color="gray" offset={10}>
          <ActionIcon
            size={32}
            variant="light"
            color="teal"
            onClick={() => downloadExcel(sortedData)}
          >
            <IconTableExport
              style={{ width: "70%", height: "70%" }}
              stroke={1.5}
            />
          </ActionIcon>
        </Tooltip>
      </div>

      <ScrollArea
        className="mt-8"
        style={{ height: 400 }}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table
          highlightOnHover
          horizontalSpacing="md"
          verticalSpacing="xs"
          miw={tableMinWidth}
          layout="fixed"
        >
          <Table.Thead
            className={cx(classes.header, {
              [classes.scrolled || ""]: scrolled,
            })}
          >
            <Table.Tr>
              <Table.Th className="w-[8rem]">ID</Table.Th>
              <Th
                sorted={sortBy === "serialNumber"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("serialNumber")}
              >
                S/N
              </Th>
              <Th
                sorted={sortBy === "brand"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("brand")}
              >
                Marca
              </Th>
              <Th
                sorted={sortBy === "modelName"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("modelName")}
              >
                Modelo
              </Th>
              <Th
                sorted={sortBy === "userName"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("userName")}
              >
                Usuario
              </Th>
              <Th
                sorted={sortBy === "office"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("office")}
              >
                Sede
              </Th>
              <Table.Th>Fecha de entrega</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={8}>
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

export default TableList;
