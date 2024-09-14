import { ChangeDetectorRef, Component, TRANSLATIONS } from '@angular/core';
import { RouterPage } from '../dashboard/router.page';
import { Platform, LoadingController, AlertController } from '@ionic/angular';
import { InvoiceService } from '../services/invoice/invoice.service';
import { SubjectService } from '../services/subject/subject.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-session',
  templateUrl: './session.page.html',
  styleUrls: ['./session.page.scss'],
})
export class SessionPage extends RouterPage{

  public sessionDetail:any;
  public withdraw:any;
  public showError = false;
  public userName: any;
  public isWithdrawn = 'false';
  public userId: any;
  public role: any;
  public branchId: any;
  public branchName: any;
  public executed = false;
  public createSession = false;
  selectedPaymentModeName: any;
  total: any;

  constructor(private platform: Platform,
    private invoiceService: InvoiceService,
    private loading: LoadingController,
    private alertController: AlertController,
    private subjectService: SubjectService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute) {
      super(router,route);    
  }


  onEnter(){
    this.cdr.detectChanges()
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
                  this.cdr.detectChanges()

                  this.getCurrentStatus();
                  // this.getActiveSession();

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


  async getCurrentStatus() {
                      
    if(this.role === 'operator') {
    let loader = await this.loading.create({
      message: 'Please wait...',
    });

    loader.present().then(() => {
      
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
          this.isWithdrawn = 'false'
        } else {
          this.subjectService.setSessionId(res.data.session_id);
          this.subjectService.setSessionBalance(Number(res.data.session_amount));
          this.sessionDetail = res.data
          this.isWithdrawn = res.data.isWithdrawn
        }
        loader.dismiss()
      },err => loader.dismiss())
    })
    this.getAllBills()
  }
}



  withdrawCash(val){
    if(val > this.sessionDetail.drawer_balance) {
      this.showError = true
    } else {
      this.showError = false
      this.isWithdrawn = 'true'
      let drawerBalance = this.sessionDetail.drawer_balance - val;
      const data = {
        withdrawn:val,
        drawer_balance:drawerBalance,
        isWithdrawn: 'true'
      }
      this.invoiceService.updateSession(data,this.sessionDetail.session_id).subscribe((res) => {
        this.withdraw  = '';
        this.getCurrentStatus()
      },err=>console.log(err))
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
                  this.getCurrentStatus();
                  this.subjectService.setSessionId(res.data.session_id);
                  this.subjectService.setSessionBalance(Number(res.data.session_amount));
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



  async getAllBills(){
    if(this.role === 'operator') {

      let loader = await this.loading.create({
        message: 'Please wait...',
      });
  
      loader.present().then(() => {
        let data = {
           
          payment_mode: 'Cash',
          branch_id: this.branchId,

        }
 
   
          let filterStr = '';
          for (let item in data) {
             if(data[item]) {
               filterStr = `${filterStr}${item}=${data[item]}&`
             }
             }
        this.invoiceService.getAllBill(filterStr).subscribe((res) => {
            if(res.data?.result) {               
                this.total = 0;
                this.total = +(res.data.total.split('-')[0]);              
            } else {
              this.total = 0;
            }
             loader.dismiss()
        }, err => loader.dismiss())
  
      })
    } 
  }




 



}
