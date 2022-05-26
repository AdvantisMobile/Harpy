import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { mapToModel } from "../shared/utils/app.mapper";
import { Question } from "../models/question.model";

@Injectable({
  providedIn: "root"
})
export class QuestionService {
  constructor(private db: AngularFireDatabase) {

  }

  add(question: Question) {
    this.db.list(`questions/`).push(question);
  }
  get(key: string) {
    return this.db.object<Question>(`questions/${key}`).valueChanges();
  }

  getAll() {
    return mapToModel(
      this.db.list<Question>(`/questions`).snapshotChanges()
    );
  }

  update(question: Question, key: string) {
    this.db.object(`questions/${key}`).update(question);
  }

  delete( key: string) {
    this.db.object(`questions/${key}`).remove();
    
  }

  getSetorQuestion(setor: string){
    return mapToModel(
      this.db.list('/questions', ref => ref.orderByChild('setor').equalTo(setor)).snapshotChanges()
    );
  }
  getCategoryQuestion(category: string){
    return mapToModel(
      this.db.list('/questions', ref => ref.orderByChild('category').equalTo(category)).snapshotChanges()
    );
  }
}
