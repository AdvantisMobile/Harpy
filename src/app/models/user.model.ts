import { Exam } from "./exam.model";

export class User {
  key?: string;
  email: string;
  password: string;
  userName: string;
  firstName: string;
  lastName: string;
  insertDate: string;
  status: string;
  exams: Exam[];
}
export class Client{
  key?: string;
  name: string;
  email: string;
  telephone: string;
}