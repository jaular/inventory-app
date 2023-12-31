export type PostProps = {
  status: boolean;
  serialNumber: string;
  name: string;
  brand: string;
  modelName: string;
  range: string;
  ram: string;
  accessories: string[];
  condition: string;
  macE: string;
  macW: string;
  userName: string;
  management: string;
  department: string;
  office: string;
  date: any;
  orderNumber: string;
  note: string;
};

export type UserProps = {
  name: string;
  email: string;
  role: string;
};

export type UserSessionProps = {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  id: string;
  role: string;
};

export type AccProps = {
  status: boolean;
  type: string;
  serialNumber: string;
  brand: string;
  modelName: string;
  condition: string;
  connector: string;
  userName: string;
  department: string;
  office: string;
  date: any;
  note: string;
};
