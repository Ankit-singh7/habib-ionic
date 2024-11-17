import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  public activatedRoute = window.location.pathname;
  public previousRoute = '';
  public title: string

  constructor(private route: Router,
    private navCtrl: NavController) {
    this.route.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.title = '';
        this.activatedRoute = window.location.pathname;
        if(this.activatedRoute.includes(';')) {
          this.activatedRoute = this.activatedRoute.split(';')[0]
          if(this.activatedRoute === '/con/employee-sales-details') {
            this.title = 'Sales Details'
          }
        }
        if (this.activatedRoute === '/con/dashboard') {
          this.title = 'My Dashboard'
        }
        if (this.activatedRoute === '/con/billing') {
          this.title = 'Create Bill / Invoice'
        }
        if (this.activatedRoute === '/con/billing-list') {
          this.title = 'Billing List'
        }
        if (this.activatedRoute === '/con/billing-view') {
          this.title = 'Billing Detail'
        }
        if (this.activatedRoute === '/con/product-usage-detail') {
          this.title = 'Product Usage Detail'
        }
        if (this.activatedRoute === '/con/edit-bill') {
          this.title = 'Edit Bill'
        }
        if(this.activatedRoute === '/con/session') {
          this.title = 'Session Status'
        }
        if(this.activatedRoute === '/con/closing-balance') {
          this.title = 'Add Closing Balance'
        }
        if(this.activatedRoute === '/con/setting') {
          this.title = 'Settings'
        }
        if(this.activatedRoute === '/con/email-validation') {
          this.title = 'Email Validation'
        }
        if(this.activatedRoute === '/con/password-reset') {
          this.title = 'Reset Password'
        }
        if(this.activatedRoute === '/con/change-password') {
          this.title = 'Change Password'
        }
        if(this.activatedRoute === '/tabs/queue') {
          this.title = 'New Orders'
        }
        if(this.activatedRoute === '/tabs/cook') {
          this.title = 'Cooking'
        }
        if(this.activatedRoute === '/tabs/dispatch') {
          this.title = 'Completed Order'
        }
        if(this.activatedRoute === '/con/create-appointment') {
          this.title = 'Create Appointment'
        }
        if(this.activatedRoute === '/con/appointment-list') {
          this.title = 'Pending Appointments'
        }
        if(this.activatedRoute === '/con/appointment-edit') {
          this.title = 'Edit Appointment'
        }
        if(this.activatedRoute === '/con/service-sales') {
          this.title = 'Service Sales Report'
        }
        if(this.activatedRoute === '/con/product-sales') {
          this.title = 'Product Sales Report'
        }
        if(this.activatedRoute === '/con/employee-wise-sales') {
          this.title = 'Employee Wise Sales'
        }
      }

    })
  }

  ngOnInit() { }

  goback() {
    this.navCtrl.pop();
  }


}
