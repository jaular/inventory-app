import { z } from "zod";

const documentIdRegex = /^\d{7,8}$/;
const phoneNumberRegex =
  /^\+?\d{1,4}?[-.\s]?\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
// https://www.abstractapi.com/guides/validate-phone-number-javascript
// https://uibakery.io/regex-library/phone-number

const macRegex = /^[a-fA-F0-9]{2}(:[a-fA-F0-9]{2}){5}$/;

export const postSchema = z.object({
  n: z.string().cuid().optional(),
  status: z.boolean(),
  serialNumber: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  name: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  brand: z
    .string()
    .min(1, { message: "Elige una opción" })
    .trim()
    .or(z.literal("")),
  modelName: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  range: z
    .string()
    .min(1, { message: "Elige una opción" })
    .trim()
    .or(z.literal("")),
  ram: z
    .string()
    .min(1, { message: "Elige una opción" })
    .trim()
    .or(z.literal("")),
  accessories: z.string().array().optional(),
  condition: z.string().min(1, { message: "Elige una opción" }).trim(),
  macE: z
    .string()
    .regex(macRegex, {
      message: "Dirección MAC invalida",
    })
    .trim()
    .or(z.literal("")),
  macW: z
    .string()
    .regex(macRegex, {
      message: "Dirección MAC invalida",
    })
    .trim()
    .or(z.literal("")),
  userName: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  management: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  department: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  office: z.string().min(1, { message: "Elige una opción" }).trim(),
  date: z
    .date({
      required_error: "Please select a date and time",
      invalid_type_error: "That's not a date!",
    })
    .nullable(),
  orderNumber: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  note: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
});

export const userSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  email: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  role: z.string().min(1, { message: "Elige una opción" }).trim(),
});

export const accSchema = z.object({
  n: z.string().cuid().optional(),
  status: z.boolean(),
  type: z.string().min(1, { message: "Elige una opción" }).trim(),
  serialNumber: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  brand: z
    .string()
    .min(1, { message: "Elige una opción" })
    .trim()
    .or(z.literal("")),
  modelName: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  condition: z.string().min(1, { message: "Elige una opción" }).trim(),
  connector: z
    .string()
    .min(1, { message: "Elige una opción" })
    .trim()
    .or(z.literal("")),
  userName: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  department: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  office: z.string().min(1, { message: "Elige una opción" }).trim(),
  date: z
    .date({
      required_error: "Please select a date and time",
      invalid_type_error: "That's not a date!",
    })
    .nullable(),
  note: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
});

export const postTrackingSchema = z.object({
  n: z.string().cuid(),
  status: z.boolean(),
  serialNumber: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  name: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  brand: z
    .string()
    .min(1, { message: "Elige una opción" })
    .trim()
    .or(z.literal("")),
  modelName: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  range: z
    .string()
    .min(1, { message: "Elige una opción" })
    .trim()
    .or(z.literal("")),
  ram: z
    .string()
    .min(1, { message: "Elige una opción" })
    .trim()
    .or(z.literal("")),
  accessories: z.string().array().optional(),
  condition: z.string().min(1, { message: "Elige una opción" }).trim(),
  macE: z
    .string()
    .regex(macRegex, {
      message: "Dirección MAC invalida",
    })
    .trim()
    .or(z.literal("")),
  macW: z
    .string()
    .regex(macRegex, {
      message: "Dirección MAC invalida",
    })
    .trim()
    .or(z.literal("")),
  userName: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  management: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  department: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  office: z.string().min(1, { message: "Elige una opción" }).trim(),
  date: z
    .date({
      required_error: "Please select a date and time",
      invalid_type_error: "That's not a date!",
    })
    .nullable(),
  orderNumber: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  note: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
});

export const accTrackingSchema = z.object({
  n: z.string().cuid(),
  status: z.boolean(),
  type: z.string().min(1, { message: "Elige una opción" }).trim(),
  serialNumber: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  brand: z
    .string()
    .min(1, { message: "Elige una opción" })
    .trim()
    .or(z.literal("")),
  modelName: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  condition: z.string().min(1, { message: "Elige una opción" }).trim(),
  connector: z
    .string()
    .min(1, { message: "Elige una opción" })
    .trim()
    .or(z.literal("")),
  userName: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  department: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
  office: z.string().min(1, { message: "Elige una opción" }).trim(),
  date: z
    .date({
      required_error: "Please select a date and time",
      invalid_type_error: "That's not a date!",
    })
    .nullable(),
  note: z
    .string()
    .min(2, { message: "Debe tener 2 o más caracteres" })
    .trim()
    .or(z.literal("")),
});
