import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireModule } from "@angular/fire";
import { environment } from "src/environments/environment";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AdmobFreeService } from "./services/admobfree.service";
import { AdMobFree } from "@ionic-native/admob-free/ngx";
import { EmailComposer } from '@ionic-native/email-composer/ngx';

import { ComponentsModule } from './components/components.module';
import { CommentModalComponent } from './components/comment-modal/comment-modal.component';

// imports
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';

@NgModule({
  declarations: [AppComponent],
   
  imports: [
    BrowserModule,
    HttpClientModule,
    ComponentsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  entryComponents: [
    CommentModalComponent
  ],
 
  providers: [
    StatusBar,
    SplashScreen,
    SocialSharing,
    OneSignal,
    File,
    FileOpener,
    EmailComposer,
    PDFGenerator,
    AdMobFree,
    AdmobFreeService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
