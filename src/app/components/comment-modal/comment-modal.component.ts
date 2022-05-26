import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { emailValidator } from "src/app/shared/utils/app-validators";
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss'],
})
export class CommentModalComponent implements OnInit {
  @Input("type") type: string;
  viewType = '';
  infoForm: FormGroup;
  userInfo: any;
  constructor(
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
  ) { 
     
  }

  ngOnInit() {
    this.viewType = this.type;
    this.userInfo={
      email:'',
      phoneNumber: ''
    };
    this.createForm();
  }
  createForm() {
    this.infoForm = this.formBuilder.group({
      email: ["", Validators.compose([Validators.required, emailValidator])],
      phoneNumber: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });
  }
  accept(values: Object): void {
    if (this.infoForm.valid) {
      this.userInfo={
        email:values["email"],
        phoneNumber: values["phoneNumber"]
      }
      console.log('UserInformation', this.userInfo);
      this.closeModal();
      
    }
    
  }
  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(this.userInfo);
  }
  async closeContactModal(){
    
  }
}
