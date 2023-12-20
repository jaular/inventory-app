export type PostProps = {
  serialNumber: string;
  name: string;
  brand: string;
  modelName: string;
  // macE: string;
  range: string;
  ram: string;
  accessories: string[];
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

export type AccProps = {
  type: string;
  serialNumber: string;
  brand: string;
  modelName: string;
  condition: string;
  userName: string;
  department: string;
  date: any;
  note: string;
};
