import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import {File} from '@ionic-native/file/ngx'
import {SuperTabsModule} from '@ionic-super-tabs/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {IonicStorageModule} from '@ionic/storage'
import { IonicSelectableModule } from 'ionic-selectable';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Printer } from '@ionic-native/printer/ngx';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot({ swipeBackEnabled: false }), 
    AppRoutingModule,
    HttpClientModule,
    SuperTabsModule.forRoot(),
    IonicStorageModule.forRoot(),
    IonicSelectableModule,
    BrowserAnimationsModule

  ],
  providers: [
    SplashScreen,
    File,
    FileOpener,
    SocialSharing,
    PDFGenerator,
    Printer,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
