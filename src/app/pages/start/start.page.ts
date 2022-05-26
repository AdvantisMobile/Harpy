import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  public isAccept: boolean = false;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  accept(){
    console.log('is Accept', this.isAccept);
    this.isAccept != this.isAccept;
  }

  start(){
    console.log('start');
    if(this.isAccept){
      this.router.navigateByUrl("select");
    }
  }
}
