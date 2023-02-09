import { Component, OnInit } from '@angular/core';
import { RouterPage } from '../dashboard/router.page';
import { InvoiceService } from '../services/invoice/invoice.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { SubjectService } from '../services/subject/subject.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage extends RouterPage{

  public total:any;
  public userName: any;
  public userId: any;
  public role: any;
  public branchId: any;
  public branchName: any;

  constructor(
    private invoiceService: InvoiceService,
    private loading: LoadingController,
    private alertController: AlertController,
    private subjectService: SubjectService,
    private router: Router,
    private route: ActivatedRoute) { 
      super(router,route)
      this.subjectService.getFullName().subscribe((res) => {
        this.userName = res;
      })

      this.subjectService.getUserId().subscribe((res) => {
        this.userId = res
      })

      this.subjectService.getRole().subscribe((res) => {
        this.role  = res
      })

      this.subjectService.getBranchId().subscribe((res) => {
        this.branchId = res
      })
    
      this.subjectService.getBranchName().subscribe((res) => {
        this.branchName = res
      })
    }

    onEnter(){
      this.subjectService.getUserId().subscribe((res) => {
        this.userId = res
      })

      this.subjectService.getRole().subscribe((res) => {
        this.role  = res
      })

      this.subjectService.getBranchId().subscribe((res) => {
        this.branchId = res
      })
    
      this.subjectService.getBranchName().subscribe((res) => {
        this.branchName = res
      })
      this.getCurrentStatus()
      this.getTotalSales();
      this.subjectService.getFullName().subscribe((res) => {
        this.userName = res;
      })
    }


    getTotalSales = () => {
      this.invoiceService.getTotal().subscribe((res) => {
        if(res.data) {
          this.total = res.data[0].total;
        } else {
          this.total = 0;
        }
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
        backdropDismiss: false,
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
