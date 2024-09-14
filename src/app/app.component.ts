import { Component } from '@angular/core';
import { MenuController, LoadingController, AlertController, Platform } from '@ionic/angular';
import { SubjectService } from './services/subject/subject.service';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public userId: any;
  public role: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private menu: MenuController,
    public subjectService: SubjectService,
    public loading: LoadingController,
    private router: Router,
    ) {
      this.initializeApp();
      this.subjectService.getUserId().subscribe((res) => {
        this.userId = res
      })

      this.subjectService.getRole().subscribe((res) => {
        this.role  = res
      })
    }

  closeMenu() {
    this.menu.close();
  }


  initializeApp(){
    this.platform.ready().then(() => {
      this.splashScreen.hide();

    })
  }




  async logout(){
    let loader = await this.loading.create({
      message: 'Please wait...',
    });
    loader.present().then(() => {
      this.router.navigate(['/home'])
      this.subjectService.resetAllSubjects();
      localStorage.clear();
      loader.dismiss();
    })
  }



}
