import { Category } from './category.model';

export class Exam {
  key?: string;
  userKey: string;
  quiz: Category;
  correct: number;
  mistake: number;
  unanswered: number;
  insertDate: string;
}
