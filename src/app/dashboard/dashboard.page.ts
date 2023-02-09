import { Component } from '@angular/core';
import { RouterPage } from './router.page';
import { Platform, LoadingController, AlertController } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { InvoiceService } from '../services/invoice/invoice.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { SubjectService } from '../services/subject/subject.service';

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

  constructor(
    private invoiceService: InvoiceService,
    private loading: LoadingController,
    private alertController: AlertController,
    private subjectService: SubjectService,
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





    async getAllBills(){


        if(this.role === 'operator') {
    
          let loader = await this.loading.create({
            message: 'Please wait...',
          });
      
          loader.present().then(() => {
            let data = {
              branch_id: this.branchId
            }

             
          let filterStr = '';
          for (let item in data) {
             if(data[item]) {
               filterStr = `${filterStr}${item}=${data[item]}&`
             }
             }
     
    
            this.invoiceService.getAllBill(filterStr).subscribe((res) => {
                if(res.data?.result) {
      
                  this.total = 0
                  for(let item of res.data.result) {
                     this.total = this.total + item.total_price
                  }
                } else {
                  this.total = 0;
                }
                 loader.dismiss()
            }, err => loader.dismiss())
      
          })
        } else if(this.role === 'admin'){
          let loader = await this.loading.create({
            message: 'Please wait...',
          });
      
          loader.present().then(() => {
            let data = {
              branch_id: this.branchId
            }

             
          let filterStr = '';
          for (let item in data) {
             if(data[item]) {
               filterStr = `${filterStr}${item}=${data[item]}&`
             }
             }
     
    
            this.invoiceService.getAllBill(filterStr).subscribe((res) => {
                if(res.data?.result) {
      
                  this.total = 0
                  for(let item of res.data.result) {
                     this.total = this.total + item.total_price
                  }
                } else {
                  this.total = 0;
                }
                 loader.dismiss()
            }, err => loader.dismiss())
      
          })
        } else if( this.role === 'employee') {
          let loader = await this.loading.create({
            message: 'Please wait...',
          });
    
          let data = {
            employee_id: this.userId
          }
    
    
          let filterStr = '';
          for (let item in data) {
             if(data[item]) {
               filterStr = `${filterStr}${item}=${data[item]}&`
             }
             }
    
      
          loader.present().then(() => {
            this.invoiceService.getAllBill(filterStr).subscribe((res) => {
                if(res.data.result) {
      
                  this.total = 0
                  for(let item of res.data.result) {
                     this.total = this.total + item.total_price
                  }
                }
                 loader.dismiss()
            }, err => loader.dismiss())
      
          })
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
