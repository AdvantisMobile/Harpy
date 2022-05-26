import { Question } from "./question.model";

export class Category {
  key?: string;
  title: string;
  description: string;
  quantity: number;
  duration: number;
  status: boolean;
  insertDate: string;
  examCount: number;
  questions: Question[];  
}
