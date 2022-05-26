import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import * as HighCharts from 'highcharts';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { range } from 'rxjs';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { CommentModalComponent } from '../../components/comment-modal/comment-modal.component';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
//PDF GENERATOR
import JSPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File, IWriteOptions } from '@ionic-native/file/ngx';

//IMG GENERATOR
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { emailValidator } from "src/app/shared/utils/app-validators";

import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {
  success: number;
  failed: number;
  contactEmail: string;
  phoneNumber: string;
  resultText: string;
  bannerLink: string;

  showPDFContent: boolean;

  infoForm: FormGroup;
  userInfo: any;
  loading: any;
  constructor(
    public loadingController: LoadingController,
    public modalCtrl: ModalController,
    public alertController: AlertController,
    private file: File,
    private fileOpener: FileOpener,
    public route: ActivatedRoute,
    public router: Router,
    public emailComposer: EmailComposer,
    private formBuilder: FormBuilder,
    public userService: UserService,
    private pdfGenerator: PDFGenerator
  ) {
    
   }

  ngOnInit() {
    this.contactEmail = 'contato@harpy.net.br';
    this.resultText = '';
    this.bannerLink = '';
    this.showPDFContent = false;
    this.route.queryParams.subscribe(params => {
      if(params && params.exam){
        console.log('Param Value', params.exam);
        this.success = parseInt(params.exam); // Convert to number from string;
        this.getResult(this.success);
      }
    });
    this.userInfo={
      name: '',
      email:'',
      phoneNumber: ''
    };
    this.createForm();
 
  }
  createForm() {
    this.infoForm = this.formBuilder.group({
      name:[''],
      email: ["", Validators.compose([Validators.required, emailValidator])],
      phoneNumber: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });
  }
  ionViewDidEnter(){
    // this.pieChartView();
    // this.highChartView();
    this.axisChartView();  
  }
  getResult(score: number){
    if(score < 50){
      this.resultText = "Não Conforme";
      this.bannerLink = "assets/imgs/banner_01.png";
    }else if((score <= 70) && (score > 50)){
      this.resultText = "Parcialmente";
      this.bannerLink = "assets/imgs/banner_02.png";
    }else if((score <= 100) && (score > 70)){
      this.resultText = "Em Conformidade";
      this.bannerLink = "assets/imgs/banner_03.png";
    }
  }
  pieChartView(){
    let chart = am4core.create("container", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    let BgSuccess = new am4core.LinearGradient();
    BgSuccess.addColor(am4core.color("#e2202c"));

    let BgFailed = new am4core.LinearGradient();
    BgFailed.addColor(am4core.color("#00a85a"));
    chart.data = [
      {
        name: "Success",
        value: 600,
        "color":BgSuccess,
      },
      {
        name: "failed",
        value: 400,
        "color":BgFailed,
      }
    ];
    chart.radius = am4core.percent(100);
    chart.innerRadius = am4core.percent(60);
    chart.startAngle = 180;
    chart.endAngle = 360;
    chart.draggable = false;
    chart.hoverable = false;
    chart.clickable = false;

    chart.background.visible = false;
    chart.logo.visible = false;

    var series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "value";
    series.dataFields.category = "name";
    series.slices.template.propertyFields.fill = 'color';
    
    series.ticks.template.disabled = true;
    series.labels.template.disabled = true;

    series.slices.template.draggable = false;
    series.slices.template.inert = false;
    series.alignLabels = false;

    let slice = series.slices.template;
    slice.states.getKey("hover").properties.scale = 1;
    slice.states.getKey("active").properties.shiftRadius = 0;

    series.hiddenState.properties.startAngle = 90;
    series.hiddenState.properties.endAngle = 90;

    // chart.legend = new am4charts.Legend();
  }

  highChartView(){
    HighCharts.chart('container', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        backgroundColor: '#ffffff'
      },
      title: {
        text: this.success +"<br><span style='color:blue;font-size:18px;margin-top:20px;'>PARCIAL</span>",
        align: 'center',
        verticalAlign: 'middle',
        y: 95,
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: false,
            distance: -10,
            style: {
              fontWeight: 'bold',
              color: 'white'
            }
          },
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '75%'],
          size: '110%'
        }
      },
      series: [{
        type: 'pie',
        innerSize: '50%',
        data: [
          {
            y: this.success,
            name: "Success",
            color: "#e2202c"
          },
          {
            y: this.failed,
            name: "Failed",
            color: "#00a85a"
          },
           
        ]
      }]
    });
  }

  axisChartView(){
    am4core.useTheme(am4themes_animated);

    // create chart
    var chart = am4core.create("container", am4charts.GaugeChart);
  
    chart.innerRadius = am4core.percent(100);
  
    chart.draggable = false;
    chart.hoverable = false;
    chart.clickable = false;

    chart.background.visible = false;
    chart.logo.visible = false;

   
    /**
     * Normal axis
     */
    const axis = chart.xAxes.push(new am4charts.ValueAxis<any>());
    axis.min = 0;
    axis.max = 100;
    
    axis.strictMinMax = true;
    axis.renderer.radius = am4core.percent(90);
    axis.renderer.inside = true;
    axis.renderer.line.strokeOpacity = 0;
    axis.renderer.ticks.template.strokeOpacity = 0;
    axis.renderer.ticks.template.length = 0;
    axis.renderer.grid.template.disabled = false;
    
    axis.renderer.labels.template.radius = 30;
    axis.renderer.labels.template.fontSize = 12;
    axis.renderer.labels.template.adapter.add("text", function(text:string) {
      return text + "%";
    });   
    /**
     * Axis for ranges
     */
     let BgPoor = new am4core.LinearGradient();
     BgPoor.addColor(am4core.color("#ff0000"));

     let BgMedium = new am4core.LinearGradient();
     BgMedium.addColor(am4core.color("#ffa500"));

     let BgHigh = new am4core.LinearGradient();
     BgHigh.addColor(am4core.color("#00ff00"));

    var axis2 = chart.xAxes.push(new am4charts.ValueAxis<any>());
    axis2.min = 0;
    axis2.max = 100;
    axis2.renderer.innerRadius = 180;
    axis2.strictMinMax = true;
    axis2.renderer.labels.template.disabled = true;
    axis2.renderer.ticks.template.disabled = true;
    axis2.renderer.grid.template.disabled = true;


    var range0 = axis2.axisRanges.create();
    range0.value = 0;
    range0.endValue = 33.33;
    range0.axisFill.fillOpacity = 1;
    range0.axisFill.fill = BgPoor;
    // range0.label.text = "Poor";
    //range.label.align = "right";
    // range0.label.verticalCenter = "bottom";

    var range1 = axis2.axisRanges.create();
    range1.value = 33.33;
    range1.endValue = 66.64;
    range1.axisFill.fillOpacity = 1;
    range1.axisFill.fill = BgMedium;
    // range1.label.text = "Good";
    range1.label.adapter.add("horizontalCenter", function() {
      return "middle";
    });


    var range2 = axis2.axisRanges.create();
    range2.value = 66.64;
    range2.endValue = 100;
    range2.axisFill.fillOpacity = 1;
    range2.axisFill.fill = BgHigh;
    // range2.label.text = "Excellent";

    /**
     * Label
     */

    var label = chart.radarContainer.createChild(am4core.Label);
    label.isMeasured = false;
    label.fontSize = 25;
    label.x = am4core.percent(50);
    label.y = am4core.percent(100);
    label.horizontalCenter = "middle";
    label.verticalCenter = "bottom";
    label.text = "0%";


    /**
     * Hand
     */

    var hand = chart.hands.push(new am4charts.ClockHand());
    hand.axis = axis2;
    hand.innerRadius = am4core.percent(30);
    hand.startWidth = 5;
    hand.pin.disabled = true;
    hand.value = 30;

    hand.events.on("propertychanged", function(ev) {
      range0.endValue = ev.target.value;
      range1.endValue = ev.target.value;
      range2.value = ev.target.value;
      axis2.invalidate();
    });
    
    label.text = this.success + "%";
    let animation = new am4core.Animation(hand, {
        property: "value",
        to: this.success
    }, 1000, am4core.ease.cubicOut).start();
  }

  openModal(){
    this.showModal();
  }
  async showModal(){
   
    const modal = await this.modalCtrl.create({
      component: CommentModalComponent,
      cssClass: 'securityModal',
      componentProps: {
        'type': 'result'
      }
    });
    modal.onDidDismiss().then((params) => {
       console.log('Data Returned', params.data);
       this.contactEmail = params.data.email;
       this.phoneNumber = params.data.phoneNumber;
       this.showPDFContent = true;
       this.createPdf();
      //  this.createImg();
    });
    return await modal.present();
  }
  createImg(){
    let self= this;
    let pNode= document.getElementById('result');
    pNode.innerHTML="<div id='pdf-cont' style='padding: 10px;'><div class='logo-cont'><img src='assets/imgs/logo_head.png'/></div><div class='t-cont' style=' margin-top: 15px;font-weight: bold;font-size: 15px;'><div>VOCÊ ALCANÇOU O NÍVEL DE MARTURIDADE</div></div><div class='c-cont' style='margin-top: 10px;font-size: 12px;font-weight:400;'><div>A TI reativa é considerada um dos niveis mais básicos de gerenciamento que uma empresa pode ter. Ela  ainda não possui um controle documentado de seus ambientes e processos.Muitas empresas anida possuem apenas esse grau de maturidade e necessitam de diversos aprimoramentos.<br>O mode reativo funciona apenas lidando com contratempos pontuais do dia a dia da empresa, o que pode ser um problema, pois o suporte só é realizado quando as falhas já afetaram o sistema, podendo causar prejuizos maiores.<br>Neste nível, a TI passa a ter iniciativas para manter a infrasestrutura sob controle para aumentar a establilidade e disponibilidade de todos os componentes, Ela realiza o gerenciamento reativo de problemas e começa a fazer a gestão de mudanças, mas ainda sem contar com processos formais.</div></div><div class='i-cont'><h4 style='color: rgb(25, 124, 216);font-weight: bold;font-size: 15px;'>HARPY DATA VISIBLITY</h4><h5>www.harpy.net.br</h5><h6>comercial@harpy.net.br</h6></div></div>"; 
    var node = document.getElementById('pdf-cont');
    htmlToImage.toPng(node).then(function (dataUrl) {
      var img = new Image();
      img.src = dataUrl;
      self.emailSend(dataUrl);
    })
    .catch(function (error) {
      console.error('Opa, algo deu errado!', error);
    });
 

  }
  emailSend(dataUri:any){
    console.log('Blob Data', dataUri);
    const base64 = dataUri.replace('data:image/png;base64,', '');
    let subjectContent: string = "Diagnóstico LGPD - Maturidade " + this.resultText;
    let email = {
      to: this.contactEmail,
      attachments: ["base64:Maturidade.pdf//" + base64],
      subject: subjectContent,
      body: 'Prezado cliente , em anexo PDF do seu orcamento de compra. Obrigado',
      isHtml: true
    }
    this.emailComposer.open(email).then(success=>{
        var node = document.getElementById('pdf-cont');
        document.getElementById('result').removeChild(node);
    }).catch(function(error){
      console.error('Opa, algo deu errado!', error);
    });
    
     
  }
  createPdf() {
    // const pdfBlock = document.getElementById("print-wrapper");
    let pNode= document.getElementById('result');
    pNode.innerHTML="<div id='pdf-cont' style='padding: 10px;'><div class='logo-cont'><img src='assets/imgs/logo_head.png'/></div><div class='t-cont' style=' margin-top: 15px;font-weight: bold;font-size: 15px;'><div>VOCÊ ALCANÇOU O NÍVEL DE MARTURIDADE</div></div><div class='c-cont' style='margin-top: 10px;font-size: 12px;font-weight:400;'><div>A TI reativa é considerada um dos niveis mais básicos de gerenciamento que uma empresa pode ter. Ela  ainda não possui um controle documentado de seus ambientes e processos.Muitas empresas anida possuem apenas esse grau de maturidade e necessitam de diversos aprimoramentos.<br>O mode reativo funciona apenas lidando com contratempos pontuais do dia a dia da empresa, o que pode ser um problema, pois o suporte só é realizado quando as falhas já afetaram o sistema, podendo causar prejuizos maiores.<br>Neste nível, a TI passa a ter iniciativas para manter a infrasestrutura sob controle para aumentar a establilidade e disponibilidade de todos os componentes, Ela realiza o gerenciamento reativo de problemas e começa a fazer a gestão de mudanças, mas ainda sem contar com processos formais.</div></div><div class='i-cont'><h4 style='color: rgb(25, 124, 216);font-weight: bold;font-size: 15px;'>HARPY DATA VISIBLITY</h4><h5>www.harpy.net.br</h5><h6>comercial@harpy.net.br</h6></div></div>"; 
    const pdfBlock = document.getElementById("pdf-cont");
    const options = { 
      background: "white", 
      height: pdfBlock.clientHeight, 
      width: pdfBlock.clientWidth 
    };

    domtoimage.toPng(pdfBlock, options).then((fileUrl) => {
      var doc = new JSPDF("p","mm","a4");
      doc.addImage(fileUrl, 'PNG', 1, 1, 100, 100);
      console.log('fileURL', fileUrl);
      console.log('DOC', doc);
       
      let docRes = doc.output();
      let url = 'data:application/pdf;base64,' + btoa(docRes);
      console.log('PDF FILE======>>>', url);
      let buffer = new ArrayBuffer(docRes.length);
      let array = new Uint8Array(buffer);
      for (var i = 0; i < docRes.length; i++) {
          array[i] = docRes.charCodeAt(i);
      }
      console.log('buffer============', buffer);
      const directory = this.file.externalApplicationStorageDirectory;
      const fileName = "Maturidade.pdf";

      let options: IWriteOptions = { 
        replace: true 
      };
  
      this.file.checkFile(directory, fileName).then((res)=> {
        this.file.writeFile(directory, fileName,buffer, options)
        .then((res)=> {
          console.log("File generated" + JSON.stringify(res));
          this.fileOpener.open(this.file.externalApplicationStorageDirectory + fileName, 'application/pdf')
            .then(() =>{
              console.log('File is exported', this.file.externalApplicationStorageDirectory);
              this.sendEmail(this.file.externalApplicationStorageDirectory, fileName);
            })
            .catch(e => console.log(e));
        }).catch((error)=> {
          console.log(JSON.stringify(error));
        });
      }).catch((error)=> {
        this.file.writeFile(directory,fileName,buffer).then((res)=> {
          console.log("File generated" + JSON.stringify(res));
          this.fileOpener.open(this.file.externalApplicationStorageDirectory + fileName, 'application/pdf')
            .then(() =>{
              console.log('File exported',  this.file.externalApplicationStorageDirectory);
              this.sendEmail(this.file.externalApplicationStorageDirectory, fileName); 
            })
            .catch(e => console.log(e));
        })
        .catch((error)=> {
          console.log(JSON.stringify(error));
        });
      });
    }).catch(function (error) {
      console.error(error);
    });
  }

  sendEmail(fireDirectory:any, fileName:any){
    this.showPDFContent = false;
    let subjectContent: string = "Diagnóstico LGPD - Maturidade " + this.resultText;
    let email = {
      to: this.contactEmail,
      attachments: [fireDirectory + fileName],
      subject: subjectContent,
      body: 'Prezado cliente , em anexo PDF do seu orcamento de compra. Obrigado',
      isHtml: true
    }
    this.emailComposer.open(email);
  }
  accept(values: Object): void {
    if (this.infoForm.valid) {
      this.userInfo={
        name: values['name'],
        email:values["email"],
        phoneNumber: values["phoneNumber"]
      }
      console.log('UserInformation', this.userInfo);
      this.userService.addClient(this.userInfo);
      this.presentLoading();
      setTimeout(()=>{                           //<<<---using ()=> syntax
        this.infoForm = this.formBuilder.group({
          name:[''],
          email: ["", Validators.compose([Validators.required, emailValidator])],
          phoneNumber: [
            "",
            Validators.compose([Validators.required, Validators.minLength(6)])
          ]
        });
        this.dismissLoading();
        this.showContactModal();
      }, 3000);
     
      
    }
    
  }
  async showContactModal(){
    const modal = await this.modalCtrl.create({
      component: CommentModalComponent,
      cssClass: 'contactModal',
      componentProps: {
        'type': 'contact'
      }
    });
    modal.onDidDismiss().then((params) => {
       console.log('Data Returned', params.data);
    });
    return await modal.present();
      
  }
  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: "Contatando...",
    });
    await this.loading.present();
  }
  
  async dismissLoading() {
    await this.loading.dismiss();
  }
  
}
