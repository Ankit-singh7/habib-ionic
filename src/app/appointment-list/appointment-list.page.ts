import { getLocaleDirection } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PickerController, LoadingController, AlertController } from '@ionic/angular';
import { RouterPage } from '../dashboard/router.page';
import { AppointmentService } from '../services/appointment/appointment.service';
import { DataArrayService } from '../services/data-array/data-array.service';
import { InvoiceService } from '../services/invoice/invoice.service';
import { ModeService } from '../services/mode/mode.service';
import * as moment from 'moment';
import { SubjectService } from '../services/subject/subject.service';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.page.html',
  styleUrls: ['./appointment-list.page.scss'],
})
export class AppointmentListPage extends RouterPage{


  public appointmentList = [];
  public search = '';
  public searchedInitial = '';
  public count = 0;
  public userName: any;
  public userId: any;
  public role: any;
  public branchId: any;
  public branchName: any;
  public executed = false;


  constructor(private picker: PickerController,
    private arrayService: DataArrayService,
    private subjectService: SubjectService,
    private loading: LoadingController,
    private alertController: AlertController,
    private appointmentService: AppointmentService,
    private modeService: ModeService,  
    private invoiceService: InvoiceService,      
    private router: Router,
    private route: ActivatedRoute) { 
        super(router,route) 

    }

  onEnter(){
    
    this.subjectService.getFullName().subscribe((res) => {
      this.userName = res;
      this.subjectService.getUserId().subscribe((res) => {
        this.userId = res
        this.subjectService.getRole().subscribe((res) => {
          console.log(res)
          this.role  = res
          this.subjectService.getBranchId().subscribe((res) => {
            this.branchId = res
            this.subjectService.getBranchName().subscribe((res) => {
              this.branchName = res
              if(!this.executed) {
                
                if(this.userName !== null && this.userId !== null && this.role !== null && this.branchId !== null  && this.branchName !== null) {
                  this.getAppointmentList()
                   this.getCurrentStatus();

                  this.executed = true;
                }  
              }
              
            })
          })
        })
      })
    })

  }

  ionViewDidLeave(){
    this.executed = false
  }



  async getAppointmentList(){
      let loader = await this.loading.create({
        message: 'Please wait...',
      });

      let data = {
        branch_id: this.branchId
      }

       
    let filterStr = '';
    for (let item in data) {
       if(data[item]) {
         filterStr = `${filterStr}${item}=${data[item]}&`
       }
       }

  
      loader.present().then(() => {
        this.appointmentService.getAppointmentList(filterStr).subscribe((res) => {
            if(res.data?.result) {
  
              this.appointmentList = res.data.result
            } else {
              this.appointmentList = [];
            }
           loader.dismiss()
        }, err => loader.dismiss())
  
      })
  }



  searchedText() {
    this.searchedInitial = '';
    this.count = 0;
    if (this.search !== '') {
    this.searchedInitial = this.search.split(' ')[0].split('')[0].toUpperCase();
    }
    }

    deleteBill(id){

    }

   
  async deleteAppointment(id) {
    const alert = await this.alertController.create({
      header: 'Warning!',
      message: 'Are you sure you want to delete this appointment',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.callDelete(id);
          }
        }
      ]
    });

    await alert.present();
  }


  async callDelete(id){
    let loader = await this.loading.create({
      message: 'Deleting Appointment',
    });

    loader.present().then(() => {
      
      this.appointmentService.deleteAppointment(id).subscribe((res) => {
        this.appointmentList = this.appointmentList.filter((item) => item.appointment_id !== id);
        loader.dismiss()
      },err => loader.dismiss())
    })
  }




  getCurrentStatus() {


    if(this.role === 'operator') {
      let data = {
           
        branch_id: this.branchId,
        date: moment(new Date()).format('DD-MM-YYYY'),
  
      }
     let filterStr = '';
        for (let item in data) {
           if(data[item]) {
             filterStr = `${filterStr}${item}=${data[item]}&`
           }
           }
      this.invoiceService.getCurrentSession(filterStr).subscribe((res) => {
         if(res.data === null) {
           this.presentPrompt()
           this.subjectService.setCanWithdraw('true')
         } else {
             this.subjectService.setSessionId(res.data.session_id);
             this.subjectService.setSessionBalance(Number(res.data.session_amount));
         }
      })

  
  }
}





async presentPrompt() {

  let alert =await this.alertController.create({
    header: 'Start your Session',
    subHeader:'Enter an opening balance to start the day.',
    mode: 'ios',
    inputs: [
      {
        name: 'amount',
        placeholder: 'Opening Balance',
        type: 'number'
      },
    ],
    buttons: [
      {
        text: 'Submit',
        handler: async data => {

          if(data.amount) {
                        
            let loader = await this.loading.create({
              message: 'Please wait...',
            });
        
            loader.present().then(() => {

          
              const obj = {
               session_status:'true',
               session_amount: Number(data.amount),
               user_name: this.userName,
               branch_id: this.branchId,
               branch_name: this.branchName,
               drawer_balance: Number(data.amount)
              }

              this.invoiceService.enterSessionAmount(obj).subscribe((res) => {
                this.subjectService.setSessionId(res.data.session_id);
                this.subjectService.setSessionBalance(res.data.session_amount);
                   loader.dismiss();
              },err => {
                loader.dismiss();

              })
            })
          } else {
            this.presentPrompt();
          }
        }
      }
    ]
  });
  await alert.present();
}


}
