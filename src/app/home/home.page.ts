import {LoadingController, NavController, MenuController} from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {AlertController} from '@ionic/angular';
import { UserService } from '../services/user/user.service';
import { RouterPage } from '../dashboard/router.page';
import { SubjectService } from '../services/subject/subject.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage extends RouterPage {

  public showPassword = false;
  public inputType = 'password';
  public email:string
  public password:string
  public message: any;
  public header: any;
  public rememberMe = false;
  cookieRem: any;
  cookiePass: string;
  cookieMail: string;
  loginError = false;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    public loading: LoadingController,
    private userService: UserService,
    public imageService: SubjectService,
) { 
  super(router,route)
}

onEnter(){
  this.remember();
}


async openAlertBox() {
  const addAlert = await this.alertController.create({
  header: this.header,
  mode: 'ios',
  message: this.message,
  buttons: ['OK'],
  cssClass: 'infoPopup'
  });
  await addAlert.present();
  }
  
  async dontHaveAnAccount() {
  const addAlert = await this.alertController.create({
  header: 'Call or Email us:',
  // subHeader: '',
  mode: 'ios',
  message: '7044444089<br>lovedesichinese@gmail.com',
  buttons: ['OK'],
  cssClass: 'infoPopup'
  });
  await addAlert.present();
  }
  
  togglePassword() {
  this.showPassword = !this.showPassword;
  if (this.showPassword === false) {
  this.inputType = 'password';
  } else {
  this.inputType = 'text';
  }
  }




  async login() {
    let loader = await this.loading.create({
      message: 'Please wait...',
    });
    const data = {
      email:this.email,
      password: this.password,
      }
      loader.present().then(() => {
        this.userService.login(data).subscribe((res) => {
          this.loginError =  false;
          localStorage.setItem('token', res.data.authToken);
          this.imageService.setToken(res.data.authToken);
          localStorage.setItem('isLoggedIn', 'true');
          this.imageService.setLoginStatus('true');
          this.imageService.setFullName(`${res.data.f_name} ${res.data.l_name}`)
          this.imageService.setBranchId(res.data.branch_id)
          this.imageService.setBranchName(res.data.branch_name);
          this.imageService.setRole(res.data.role)
          this.imageService.setUserId(res.data.user_id)


          
          if (this.rememberMe) {
            localStorage.setItem('email', this.email);
            localStorage.setItem('password', this.password);
            localStorage.setItem('rememberMe', String(this.rememberMe));
          } else  {
            this.email = '';
            this.password = '';
            localStorage.removeItem('email');
            localStorage.removeItem('password');
            localStorage.setItem('rememberMe', String(this.rememberMe));
          }

          this.router.navigate(['/con/dashboard'])
          loader.dismiss();
        
      },(error) => {
        this.message = error.error.message;
        this.loginError = true;
        loader.dismiss();
  
      })
    })
  }


  remember() {
    if (localStorage.getItem('rememberMe') === 'true') {
      this.cookieRem = Boolean(localStorage.getItem('rememberMe'));
      this.cookiePass = localStorage.getItem('password');
      this.cookieMail = localStorage.getItem('email');
      if (this.router.navigate(['/home'])) {
        this.rememberMe = this.cookieRem;
        this.email = this.cookieMail;
        this.password = this.cookiePass;
      }
    } else if(localStorage.getItem('rememberMe') === 'false') {
      this.cookieRem = false;
      this.email = '';
      this.password = '';
    }
  }


}
