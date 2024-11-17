import { Component } from '@angular/core';
import { RouterPage } from './router.page';
import { LoadingController, AlertController } from '@ionic/angular';
import { InvoiceService } from '../services/invoice/invoice.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { SubjectService } from '../services/subject/subject.service';
import { AppointmentService } from '../services/appointment/appointment.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage extends RouterPage {

  public total:any;
  public userName: any;
  public userId: any;
  public role: any;
  public branchId: any;
  public branchName: any;
  public executed = false;
  public total_advance_booking: any;

  constructor(
    private invoiceService: InvoiceService,
    private loading: LoadingController,
    private alertController: AlertController,
    private subjectService: SubjectService,
    private appointmentService: AppointmentService,
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
            this.role  = res
            this.subjectService.getBranchId().subscribe((res) => {
              this.branchId = res
              this.subjectService.getBranchName().subscribe((res) => {
                this.branchName = res
                if(!this.executed) {
                  
                  if(this.userName !== null && this.userId !== null && this.role !== null && this.branchId !== null  && this.branchName !== null) {
  
                    this.getCurrentStatus();

                    this.getAllBills();
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
       this.executed = false;
     }





     async getAllBills(event = null, hardRefresh = false) {    
      if(!hardRefresh){
        const storedValue = await this.subjectService.getLocalStorage('totalSalesAmount');      
        if (storedValue !== null && storedValue !== undefined) {
          this.total = storedValue;
          return;
        }
      }  
    
      // Proceed to call the API if no valid cached value is found
      let loader = await this.loading.create({
        message: 'Please wait...',
      });
    
      loader.present().then(() => {
        let data = this.getRoleBasedData();
        let filterStr = this.generateFilterString(data);
    
        this.invoiceService.getAllBill(filterStr).subscribe((res) => {
          this.processResult(res);
          loader.dismiss();
          if (event) {
            event.target.complete(); // Stop ion-refresher
          }
        }, err => {
          if (event) {
            event.target.complete(); // Stop ion-refresher
          }
          loader.dismiss()
        });
      });
    }
    
    // Function to get data based on role
    getRoleBasedData() {
      if (this.role === 'operator' || this.role === 'admin') {
        return { branch_id: this.branchId };
      } else if (this.role === 'employee') {
        return { employee_id: this.userId };
      }
      return {};
    }
    
    // Utility function to generate the filter string
    generateFilterString(data) {
      let filterStr = '';
      for (let item in data) {
        if (data[item]) {
          filterStr = `${filterStr}${item}=${data[item]}&`;
        }
      }
      return filterStr;
    }
    
    // Utility function to process the result
    processResult(res) {
      if (res?.data?.result) {
        this.total = 0;
        for (let item of res.data.result) {
          this.total += item.total_price;
        }
    
        // Update the subject with the total amount after processing the result
        this.subjectService.setLocalStorage('totalSalesAmount', this.total);
      } else {
        this.total = 0;
      }
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
            this.subjectService.setLocalStorage('totalSalesAmount', null);
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
