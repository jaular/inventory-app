import { PostProps, AccProps } from "~/lib/types";
import { writeFile, utils } from "xlsx";

type ExcelProps = PostProps & {
  n: string;
  createdBy?: {
    name: string | null;
  };
};

var new_headers = [
  "ID",
  "S/N",
  "Nombre del equipo",
  "Marca",
  "Modelo",
  // "Direccion Mac (E)",
  "Gama",
  "Memoria RAM",
  "Mouse",
  "Bolso",
  "Usuario",
  "Dirección",
  "Gerencia",
  "Sede",
  "Fecha de entrega",
];

export const downloadExcel = (sortedData: ExcelProps[]) => {
  const acc = sortedData.map((row) => ({
    mouse: row.accessories.find((item) => item === "Mouse"),
    bag: row.accessories.find((item) => item === "Bolso"),
  }));

  const rows = sortedData.map((row, i) => ({
    id: row.n,
    serialNumber: row.serialNumber,
    name: row.name,
    brand: row.brand,
    modelName: row.modelName,
    // macE: row.macE,
    range: row.range,
    ram: row.ram,
    mouse: acc[i]?.mouse === "Mouse" ? "si" : "no",
    bag: acc[i]?.bag === "Bolso" ? "si" : "no",
    userName: row.userName,
    department: row.department,
    management: row.management,
    office: row.office,
    date: row.date.toLocaleDateString(),
  }));

  // generate worksheet and workbook
  const worksheet = utils.json_to_sheet(rows);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // fix headers
  utils.sheet_add_aoa(worksheet, [new_headers], { origin: "A1" });

  // column width
  const wscols = [
    { wch: 30 },
    { wch: 30 },
    { wch: 25 },
    { wch: 20 },
    { wch: 20 },
    { wch: 15 },
    { wch: 20 },
    { wch: 10 },
    { wch: 10 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
  ];
  worksheet["!cols"] = wscols;

  // create an XLSX file
  writeFile(workbook, "Equipos.xlsx", { compression: true });
};

type ExcelProps2 = AccProps & {
  n: string;
  createdBy?: {
    name: string | null;
  };
};

var new_headers2 = [
  "ID",
  "Tipo",
  "S/N",
  "Marca",
  "Modelo",
  "Estado",
  "Usuario",
  "Dirección",
  "Fecha de entrega",
];

export const downloadExcelAcc = (sortedData: ExcelProps2[]) => {
  const rows = sortedData.map((row, i) => ({
    id: row.n,
    type: row.type,
    serialNumber: row.serialNumber,
    brand: row.brand,
    modelName: row.modelName,
    condition: row.condition,
    userName: row.userName,
    department: row.department,
    date: row.date.toLocaleDateString(),
  }));

  // generate worksheet and workbook
  const worksheet = utils.json_to_sheet(rows);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // fix headers
  utils.sheet_add_aoa(worksheet, [new_headers2], { origin: "A1" });

  // column width
  const wscols = [
    { wch: 30 },
    { wch: 25 },
    { wch: 30 },
    { wch: 20 },
    { wch: 20 },
    { wch: 15 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
  ];
  worksheet["!cols"] = wscols;

  // create an XLSX file
  writeFile(workbook, "Accesorios.xlsx", { compression: true });
};
