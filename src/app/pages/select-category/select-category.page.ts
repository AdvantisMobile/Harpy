import { Component, OnInit } from '@angular/core';
import { CategoryService } from "src/app/services/category.service";
import { Category } from "src/app/models/category.model";

import { QuestionService } from "src/app/services/question.service";
import { Question } from "src/app/models/question.model";
import { EmailComposer } from '@ionic-native/email-composer/ngx';

import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { ToastService } from "src/app/services/toast.service";
import  "../../../assets/smtp.js";
 
declare let Email: any;

@Component({
  selector: 'app-select-category',
  templateUrl: './select-category.page.html',
  styleUrls: ['./select-category.page.scss'],
})
export class SelectCategoryPage implements OnInit {
  
  isLoading: boolean = true;
  categories: Category[];
  title: any;
  details: any;
  loading: any;
  selectedIndex: any;

  setorQuestions: any = [];
  generalQuestions: any = [];

  allQuestions: any = [];
  realDataSource: any = [];

  quizIndex: any;
  maxQuestionCount: any;
  currentQuestion: any;
  currentItem: any;

  correct: number = 0;
  mistake: number = 0;
  unanswered: number = 0;
  answered: any;
  item: any;

  finalData: any = [];
  totalCount: number;
  
  contactEmail: string;
  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private questionService: QuestionService,
    private toastService: ToastService,
    public loadingController: LoadingController,
    public route: ActivatedRoute,
    public emailComposer: EmailComposer,
  ) { 
    
  }

  ngOnInit() {
    this.answered = '';
    this.quizIndex = 0;
    this.maxQuestionCount = 0;
    this.totalCount = 0;
    this.currentQuestion = [
      { question:''},
      { answerRight: ''},
      { answers: []}
    ];
    this.currentItem = [
      { title: ''},
      { visible: true},
      { data: []}
    ];
    this.contactEmail = 'contato@harpy.net.br';

    this.route.queryParams.subscribe(params => {
      if(params && params.setor && params.quantity){
        console.log('Selected Setor and Quantity', params.setor, params.quantity);
        this.getSetorQuestion(params.setor);
      }
    });

    
  }
  getItem(dataSource: any){
    this.finalData = dataSource;
    console.log('GetItem Source', dataSource);
    this.currentItem = dataSource[this.quizIndex];
    this.maxQuestionCount = dataSource.length;
    this.totalCount = dataSource.length;
    for(let i= 0; i< dataSource.length;i++){
      if(dataSource[i].visible){
        this.maxQuestionCount--;
      }
    }
    this.currentQuestion = dataSource[this.quizIndex].data;
    if(!this.currentQuestion){
      this.currentQuestion = [
        { question:''},
        { answerRight: ''},
        { answers: []}
      ];
    }
    console.log('Current Item',this.currentQuestion);
    console.log('max question count', this.maxQuestionCount);
  }
  resetItem(){
    this.answered = '';
    this.currentItem = this.finalData[this.quizIndex];
    this.maxQuestionCount = this.finalData.length;
    this.totalCount =  this.finalData.length;
    this.currentQuestion = this.finalData[this.quizIndex].data;
    for(let i= 0; i< this.finalData.length;i++){
      if(this.finalData[i].visible){
        this.maxQuestionCount--;
      }
    }
    if(!this.currentQuestion){
      this.currentQuestion = [
        { question:''},
        { answerRight: ''},
        { answers: []}
      ];
    }
    console.log('max question count', this.maxQuestionCount);
  }
  getSetorQuestion(setor:string){
    this.presentLoading();
    this.questionService.getSetorQuestion(setor).subscribe(data=>{
      // this.getRealData(setor, data);
      this.getCategories();
    });

  }
  getCategories() {
     this.categoryService.getAll().subscribe(data=>{
       this.categories = data;
       this.categories.forEach(element => {
         this.getCategoryQuestions(element.title, element.quantity);
      });
      this.dismissLoading();
     });
      
    
  }
  getCategoryQuestions(categoryTitle: string, maxCount: number){
    console.log('categoryQuestions', categoryTitle, maxCount);
    this.questionService.getCategoryQuestion(categoryTitle).subscribe(data=>{
      if(data.length > maxCount){
        this.getRealData(categoryTitle,  this.getRandomQuestion(data, maxCount));
      }else{
        this.getRealData(categoryTitle,  data);
      }
    });
    
  }
  getRealData(titleValue: string, questions: any){
    this.realDataSource.push({title:titleValue, visible:true,data:null});
    for(let j=0; j < questions.length ; j++){
      let quizItem = questions[j];
      this.realDataSource.push({title:'', visible:false, data: quizItem});
    }     
    
    console.log('Really Datas', this.realDataSource);
    this.getItem(this.realDataSource);
  }
  getRandomQuestion(data: any, count: number){
    let index = count;
    let questions :any = [];
    for(let i=0; i<index; i++){
      const indes = Math.floor(Math.random() * index) + 1;
      questions.push(data[indes]);
      data.splice(indes,i);
    }
    return questions;
  }
  prev(){
    if(this.currentQuestion.answerRight){
      if (this.currentQuestion.answered == this.currentQuestion.answerRight && this.currentQuestion.answered != ""){
        this.correct--;
      }
      if (this.currentQuestion.answered != this.currentQuestion.answerRight && this.currentQuestion.answered != "")
         this.mistake--;
      }
    this.quizIndex--;
    this.resetItem(); 
  }

  next(){
    
    if(this.currentItem.visible){
      this.quizIndex++;
      this.maxQuestionCount --;
      this.checkFinished();
    }else{
      this.quizIndex++;
      console.log('CurrentQuestionsAnswered', this.currentQuestion.answered);
      if(!this.currentQuestion.answered){
        this.toastService.presentSimpleToast("Selecione todas as respostas.!");
        return;
      }
    }
    this.checkAnswers();
    this.checkFinished();
  }
  checkFinished(){
    if(this.quizIndex == this.totalCount){
      console.log('Index and Total count', this.quizIndex, this.totalCount);
      console.log('Answers and Question Count', this.correct, this.maxQuestionCount);  
      let result = (this.correct/(this.maxQuestionCount+1))*100;
      const navData: NavigationExtras = {
        queryParams: {
          'exam': result,
        }
      };
      this.router.navigate(['result'], navData);
      return;
    }else{
      this.resetItem();
      return;
    }
  }

 checkAnswers() {
  if(!this.currentQuestion.answerRight){
    return
  }
  if (this.currentQuestion.answered == this.currentQuestion.answerRight && this.currentQuestion.answered != "")
      this.correct++;
  if (this.currentQuestion.answered != this.currentQuestion.answerRight && this.currentQuestion.answered != "")
        this.mistake++;
  if (this.currentQuestion.answered == "") this.unanswered++;    
  console.log('Correct Answers', this.correct);
}
contact(){
  let self = this;
  // let email = {
  //   to: self.contactEmail,
  //   subject: 'CONTATO PARA SUPORTE',
  //   body: 'Prezado cliente , em anexo PDF do seu orcamento de compra. Obrigado',
  //   isHtml: true
  // }
  // this.emailComposer.open(email).then(success=>{
  //   console.log('Successed!');
  // }). 
  // catch(function(error){
  //   console.log('ERROR!');
  // });

  // Email.send({
  //   Host : 'mts.tosolution.com.br',
  //   Username : 'diagnostico@harpy.net.br',
  //   Password :  '4Ev3r@Csex987l!',
  //   To : 'self.contactEmail',
  //   From :'juliofernands123@gmail.com',
  //   Subject : 'CONTATO PARA SUPORTE',
  //   Body : 'Prezado cliente , em anexo PDF do seu orcamento de compra. Obrigado'
    
  //   }).then((message:any)=>{
  //     alert(message);
  //   });
  
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
