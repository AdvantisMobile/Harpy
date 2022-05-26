import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-select',
  templateUrl: './select.page.html',
  styleUrls: ['./select.page.scss'],
})
export class SelectPage implements OnInit {

  setors: any = [];
  selectedSetor: any;

  quantities: any = [];
  selectedQuanitty: any;
  constructor(  
    private router: Router
  ) { }

  ngOnInit() {
    this.initDatas();
  }
  initDatas(){
    this.quantities = [
      {id:0, value: 'MICRO'},
      {id:1, value: 'PEQUENO'},
      {id:2, value: 'MÉDIO'},
      {id:3, value: 'GRANDE'}
    ];

    this.setors = [
      {id:0, value:'COMÉRCIO'},
      {id:1, value:'CONSTRUÇÃO'},
      {id:2, value:'EDUCAÇÃO'},
      {id:3, value:'HOSPITALAR'},
      {id:4, value:'INDUSTRIA'},
      {id:5, value:'SAÚDE'},
      {id:6, value:'SERVIÇO'},
      {id:7, value:'VEÍCULO'}
    ];
    this.selectedQuanitty = '';
    this.selectedSetor = '';
  }
  next(){
    if(this.selectedSetor === '' || this.selectedQuanitty === ''){
      return;
    }
    console.log('Selelcted Quantity', this .selectedQuanitty);
    console.log('Selelcted Setor', this .selectedSetor);
    const navData: NavigationExtras = {
      queryParams: {
        'setor': this.selectedSetor,
        'quantity': this.selectedQuanitty
      }
    };
    this.router.navigate(['select-category'], navData);
  }
  prev(){
    this.router.navigateByUrl("start");
  }

}
