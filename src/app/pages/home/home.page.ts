import { Component, OnInit } from "@angular/core";
import { QuestionService } from "src/app/services/question.service";
import { Question } from "src/app/models/question.model";
import { LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

 
@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit {
  loading: any;
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };
  isLoading: boolean = true;
  questions: Question[];
  categoryKey: string;
  qIndex: any;
  maxQuestionCount: any;
  cQuestion: any;
   
  constructor(
    public loadingController: LoadingController,
    public questionService: QuestionService,
    public authService: AuthService,
    public route: ActivatedRoute,
    public router: Router) {
       
     }

  ngOnInit() {
    this.qIndex = 0;
    this.maxQuestionCount = 0;
    this.cQuestion = [
      {question: ''},
      {answerRight: ''},
      {answers: []}
    ];
    // this.route.queryParams.subscribe(params => {
    //     console.log(params.key);
    //     if(params && params.key){
    //       this.getQuestions(params.key);
    //     }
    //   }
    // );
  }
  getQuestions(categoryKey:any) {
    this.presentLoading();
    let self = this;
    this.questionService.getAll().subscribe(data => {
      self.questions = data;
      self.maxQuestionCount = this.questions.length;
      self.cQuestion = this.questions[0];
      this.dismissLoading();
    });
  }

  getCurrentQuestion(){
    this.cQuestion = this.questions[this.qIndex];
  }
  prev(){
    this.qIndex--;
    if(this.qIndex < 0){
      this.router.navigateByUrl(`select-category`);
    } else {
      this.getCurrentQuestion();
    }
    
  }
  next(){
    this.qIndex++;
    if(this.qIndex >= this.maxQuestionCount){
      this.router.navigateByUrl('result');
    }else{
      this.getCurrentQuestion();
    }
  }
  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: "Carregando...",
    });
    await this.loading.present();
  }
  
  async dismissLoading() {
    await this.loading.dismiss();
  }
}
