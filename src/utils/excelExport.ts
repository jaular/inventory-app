import { PostProps, AccProps } from "~/lib/types";
import csvDownload from "json-to-csv-export";

type ColsProps = {
  id: string;
  header: string;
  size: number;
  minSize: number;
};

type ExcelProps = PostProps & {
  n: string;
  createdBy?: {
    name: string | null;
  };
};

// Equipment
export const downloadExcel = (sortedData: ExcelProps[], cols: ColsProps[]) => {
  const headers = cols.map((col) => col.header);
  const ids = cols.map((col) => col.id);

  const acc = sortedData.map((row) => ({
    mouse: row.accessories.find((item) => item === "Mouse"),
    keyboard: row.accessories.find((item) => item === "Teclado"),
    monitor: row.accessories.find((item) => item === "Monitor"),
    charger: row.accessories.find((item) => item === "Cargador"),
    bag: row.accessories.find((item) => item === "Bolso"),
  }));

  const rows = sortedData.map((row, i) => ({
    n: row.n,
    status: row.status ? "En uso" : "Almacenado",
    serialNumber: row.serialNumber,
    name: row.name,
    brand: row.brand,
    modelName: row.modelName,
    range: row.range,
    ram: row.ram,
    mouse: acc[i]?.mouse === "Mouse" ? "Si" : "No",
    keyboard: acc[i]?.keyboard === "Teclado" ? "Si" : "No",
    monitor: acc[i]?.monitor === "Monitor" ? "Si" : "No",
    charger: acc[i]?.charger === "Cargador" ? "Si" : "No",
    bag: acc[i]?.bag === "Bolso" ? "Si" : "No",
    condition: row.condition,
    macE: row.macE,
    macW: row.macW,
    userName: row.userName,
    department: row.department,
    management: row.management,
    office: row.office,
    orderNumber: row.orderNumber,
    note: row.note,
    date: row.date ? row.date.toLocaleDateString() : "",
  }));

  const data = rows.map((row) =>
    ids.reduce((acc, curr) => {
      // @ts-ignore
      acc[curr] = row[curr];
      return acc;
    }, {}),
  );

  const dataToConvert = {
    data: data,
    filename: "Inventario de equipos",
    // delimiter: ",",
    headers: headers,
  };
  csvDownload(dataToConvert);
};

// Accessories
type AccExcelProps = AccProps & {
  n: string;
  createdBy?: {
    name: string | null;
  };
};

export const downloadExcelAcc = (
  sortedData: AccExcelProps[],
  cols: ColsProps[],
) => {
  const headers = cols.map((col) => col.header);
  const ids = cols.map((col) => col.id);

  const rows = sortedData.map((row, i) => ({
    n: row.n,
    status: row.status ? "En uso" : "Almacenado",
    type: row.type,
    serialNumber: row.serialNumber,
    brand: row.brand,
    modelName: row.modelName,
    condition: row.condition,
    connector: row.connector,
    userName: row.userName,
    department: row.department,
    office: row.office,
    note: row.note,
    date: row.date ? row.date.toLocaleDateString() : "",
  }));

  const data = rows.map((row) =>
    ids.reduce((acc, curr) => {
      // @ts-ignore
      acc[curr] = row[curr];
      return acc;
    }, {}),
  );

  const dataToConvert = {
    data: data,
    filename: "Inventario de accesorios",
    // delimiter: ",",
    headers: headers,
  };
  csvDownload(dataToConvert);
};
