import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {

  public password:any;
  public confirmPassword: any;
  public email:any;
  public loginError = false;
  public message:any;



  public toggleField = {
    PasswordToggle: false,
    confirmPasswordToggle: false,
  };
  public inputTypeField = {
    PasswordType: 'password',
    confirmPasswordType: 'password'
  };
  constructor(private userService: UserService,
              private loading: LoadingController,
              private router: Router) { }

  ngOnInit() {
  }

  toggleIcon(field,type) {
    this.toggleField[field] = !this.toggleField[field];
    if (this.toggleField[field] === true) {
     this.inputTypeField[type] = 'text';
    } else {
      this.inputTypeField[type] = 'password';
    }
  }



  async resetPassword(){
    if(this.password !== this.confirmPassword){
      this.loginError = true;
      this.message = 'Passwords do not match'
    } else {
      
      let loader = await this.loading.create({
        message: 'Please wait...',
      });

      const data = {
        password: this.password,
        email: this.email
      }

  
      loader.present().then(() => {
         this.userService.changePassword(data).subscribe((res) => {
           if(res.status === 404) {
            this.message = res.message;
            this.loginError = true;
            loader.dismiss();
           } else {
             this.loginError = false;
             this.email = '';
             this.password = '';
             this.confirmPassword = '';
             this.message = '';
             this.router.navigate(['/home'])
             loader.dismiss();
           }
         },err => {
          this.message = err.error.message;
          this.loginError = true;
          loader.dismiss();
    
         })
      })
    }
  }
}
