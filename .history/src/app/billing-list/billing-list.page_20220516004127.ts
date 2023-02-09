import { Component, OnInit } from '@angular/core';
import { Platform, LoadingController, AlertController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { InvoiceService } from '../services/invoice/invoice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterPage } from '../dashboard/router.page';
import * as moment from 'moment';
import { SubjectService } from '../services/subject/subject.service';
import { ModeService } from '../services/mode/mode.service';
import { UserService } from '../services/user/user.service';


@Component({
  selector: 'app-billing-list',
  templateUrl: './billing-list.page.html',
  styleUrls: ['./billing-list.page.scss'],
})
export class BillingListPage extends RouterPage{

  public billArray = [];
  public total:any;
  public productTotal: any;
  public serviceTotal: any;
  public search = '';
  public searchedInitial = '';
  public count = 0;
  public selectedEmployee: any;
  public selectedPaymentMode: any;
  public selectedPaymentModeName: any;
  public selectedDeliveryModeName: any;

  public payment = [];

  public mode = []
  userName: any;
  public userId: any;
  public role: any;
  public branchId: any;
  public branchName: any;
  public employeeList = [];
  public executed = false;
  public branchList = [];
  selectedBranch: any;
  today = new Date().toISOString();
  startDate = 'Start Date';
  endDate  = 'End Date';
  formatted_start_date;
  formatted_end_date;

  startDateOption: any;
  endDateOption: any;
  monthName = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']


  constructor(private platform: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private invoiceService: InvoiceService,
    private loading: LoadingController,
    private modeService: ModeService,
    private userService: UserService,
    private subjectService: SubjectService,
    private alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute) { 
      super(router,route)

      this.startDateOption = {
        buttons: [{
          text: 'Save',
          handler: (val) => {
            if(val.day.text.length<2) {

              this.startDate = `0${val.day.text}-${moment().month(val.month.text).format("MM")}-${val.year.text}`
            } else {
              this.startDate = `${val.day.text}-${moment().month(val.month.text).format("MM")}-${val.year.text}`

            }
            this.onDateChange()
            console.log(this.startDate)
            }
        }, {
          text: 'Clear',
          handler: () => {
            this.startDate = '';
    
          }
        }]
      }

      this.endDateOption = {
        buttons: [{
          text: 'Save',
          handler:  (val) => {
            if(val.day.text.length<2) {
              this.endDate = `0${val.day.text}-${moment().month(val.month.text).format("MM")}-${val.year.text}`

            } else {

              this.endDate = `${val.day.text}-${moment().month(val.month.text).format("MM")}-${val.year.text}`
            } 
            this.onDateChange()
            console.log(this.endDate)
            }
        }, {
          text: 'Clear',
          handler: () => {
            this.endDate = ''

          }
        }]
      }
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

                this.getAllBills()

              this.getCurrentStatus();

                this.getPaymentList();
                this.getAllEmployee()
                this.getBranchList();
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
  console.log('leave calls')
  this.payment = [];
  this.mode = [];
  this.selectedPaymentMode = '';
  this.selectedEmployee = '';
  this.executed = false;
}

onDateChange() {
  if(this.startDate !== 'Start Date' && this.endDate !== 'End Date') {

    if(this.startDate && this.endDate) {
      let d1 = moment(this.startDate, 'DD-MM-YYYY').valueOf()
      let d2 = moment(this.endDate, 'DD-MM-YYYY').valueOf()
      if(d1<=d2) {
        console.log('here')
        this.getAllBills()
      } else {
          this.dateComparePopup()
      }
    } else if(!this.startDate && !this.endDate) {
      this.getAllBills()
    }
  }
}

async dateComparePopup() {
  const addAlert = await this.alertController.create({
  header: 'Warning',
  // subHeader: '',
  mode: 'ios',
  message: 'End Date cannot be smaller than Start Date',
  buttons: ['OK'],
  cssClass: 'infoPopup'
  });
  await addAlert.present();
  }


 getPaymentList(){
   this.payment = [];
  this.modeService.getPaymentModeList().subscribe((res) => {
    let tempArr = res.data.map((item) => ({
      id: item.payment_mode_id,
      name: item.payment_mode_name
    }))
    this.payment = [...this.payment,...tempArr]
  })
  let obj = {id:1,name: 'All'}
  this.payment.push(obj)
}

getAllEmployee(){
  this.employeeList = [];
  this.userService.getAllEmployee('status=Active').subscribe((res) => {
     if(res.data) {
       let tempArr = res.data.result.map((item) => ({
         name: `${item.f_name} ${item.l_name}`,
         ...item

       }))
       let obj = {id:1,name: 'All'}
       this.employeeList = [obj,...tempArr]
      

     } else {
       this.employeeList = [];
     }
  })
}

getBranchList(){
  this.branchList = [];
  this.userService.getBranchList().subscribe((res) => {
    if(res.data) {
      let tempArr = res.data.map((item) => ({
        id: item.branch_id,
        name: item.branch_name
      }))
      let obj = {id:'',name:'All'}
      this.branchList = [obj,...tempArr]
      console.log(this.branchList);
    } else {
      this.branchList = [];
    }
  })
}




  async getAllBills(){
    if(this.role === 'operator') {

      let loader = await this.loading.create({
        message: 'Please wait...',
      });
  
      loader.present().then(() => {
        let data = {
           
          payment_mode: this.selectedPaymentModeName,
          employee_id: this.selectedEmployee?.user_id,
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
              if(data.employee_id) {
                this.billArray = res.data.result.filter((item) => item.total_price !== 0)
    
                this.total = 0
                this.productTotal = 0
                this.serviceTotal = 0

                for(let item of res.data.result) {
                  item.total_price = 0
                     if(item.services) {
                       for(let service of item.services) {
                         if(service.employee_id === data.employee_id) {
                           this.total = this.total+service.total
                           this.serviceTotal = this.serviceTotal + service.total
                           item.total_price = item.total_price + service.total
                         }
                       }
                     } 
                     if(item.products) {
                      for(let product of item.products) {
                        if(product.employee_id === data.employee_id) {
                          this.total = this.total+product.total
                          this.productTotal = this.productTotal + product.total
                          item.total_price = item.total_price + product.total
                          
                        }
                      }
                    }

                    let s_total = this.serviceTotal?this.serviceTotal:0
                    let p_total = this.productTotal?this.productTotal:0
                   item.total_price = s_total + p_total
                }

              } else {
                
                this.billArray = res.data.result.filter((item) => item.total_price !== 0)
    
                this.total = 0
                this.productTotal = 0
                this.serviceTotal = 0
                this.total = res.data.total.split('-')[0]
                for (let item of res.data.result) {
                  for (let service of item.services) {
                    this.serviceTotal = this.serviceTotal + service.total
                  }
                  for (let product of item.products) {
                    this.productTotal = this.productTotal + product.total
                  }
                }
                console.log(this.productTotal)
                console.log(this.serviceTotal)
              }
            } else {
              this.total = 0;
              this.productTotal = 0;
              this.serviceTotal = 0;
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
           
          payment_mode: this.selectedPaymentModeName,
          employee_id: this.selectedEmployee?.user_id,
          branch_id: this.selectedBranch?.id,
          startDate: this.startDate?this.startDate:moment(new Date()).format('DD-MM-YYYY'),
          endDate: this.endDate?this.endDate:moment(new Date()).format('DD-MM-YYYY')
        }
 
   
          let filterStr = '';
          for (let item in data) {
             if(data[item]) {
               filterStr = `${filterStr}${item}=${data[item]}&`
             }
             }
        this.invoiceService.getAllBillAdmin(filterStr).subscribe((res) => {
            if(res.data?.result) {

              if(data.employee_id) {
                console.log('inside employee')
                this.billArray = res.data.result.filter((item) => item.total_price !== 0)
    
                this.total = 0
                this.productTotal = 0
                this.serviceTotal = 0

                for(let item of res.data.result) {
                  item.total_price = 0
                     if(item.services) {
                       for(let service of item.services) {
                         if(service.employee_id === data.employee_id) {
                           this.total = this.total+service.total
                           this.serviceTotal = this.serviceTotal + service.total
                           item.total_price = item.total_price + service.total
                         }
                       }
                     } 
                     if(item.products) {
                      for(let product of item.products) {
                        if(product.employee_id === data.employee_id) {
                          this.total = this.total+product.total
                          this.productTotal = this.productTotal + product.total
                          item.total_price = item.total_price + product.total
                        }
                      }
                    }

                    let s_total = this.serviceTotal?this.serviceTotal:0
                    let p_total = this.productTotal?this.productTotal:0
                   item.total_price = s_total + p_total
                }

              } else {
                console.log('no employee')
                
                            this.billArray = res.data.result.filter((item) => item.total_price !== 0)
                            this.total = 0
                            this.productTotal = 0
                            this.serviceTotal = 0
                            this.total = res.data.total.split('-')[0]
                            for (let item of res.data.result) {
                                for (let service of item.services) {
                                  this.serviceTotal = this.serviceTotal + service.total
                                }
                                for (let product of item.products) {
                                  this.productTotal = this.productTotal + product.total
                                }
                            }
                            console.log(this.productTotal)
                            console.log(this.serviceTotal)
              }
            } else {
              this.total = 0;
              this.productTotal = 0;
              this.serviceTotal = 0;
            }
             loader.dismiss()
        }, err => loader.dismiss())
  
      })

    } else if( this.role === 'employee') {
      let loader = await this.loading.create({
        message: 'Please wait...',
      });

      let data = {
        payment_mode: this.selectedPaymentModeName,
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
  
                this.billArray = res.data.result.filter((item) => item.total_price !== 0)
    
                this.total = 0
                this.productTotal = 0
                this.serviceTotal = 0

                for(let item of res.data.result) {
                  item.total_price = 0
                     if(item.services) {
                       for(let service of item.services) {
                         if(service.employee_id === data.employee_id) {
                           this.total = this.total+service.total
                           this.serviceTotal = this.serviceTotal + service.total
                           item.total_price = item.total_price + service.total
                         }
                       }
                     } 
                     if(item.products) {
                      for(let product of item.products) {
                        if(product.employee_id === data.employee_id) {
                          this.total = this.total+product.total
                          this.productTotal = this.productTotal + product.total
                          item.total_price = item.total_price + product.total
                        }
                      }
                    }
                }
            } else {
              this.total = 0;
              this.productTotal = 0;
              this.serviceTotal = 0;
            }
             loader.dismiss()
        }, err => loader.dismiss())
  
      })
    }
  }


  branchChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.selectedBranch = event.value

    // this.getTotalSales()
    this.getAllBills();
  }



  async deleteAppointment(id) {
    const alert = await this.alertController.create({
      header: 'Warning!',
      message: 'Are you sure you want to delete this Bill',
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
      message: 'Deleting Bill...',
    });

    loader.present().then(() => {
      
      this.invoiceService.deleteBill(id).subscribe((res) => {

       this.billArray =  this.billArray.filter((item) => item.bill_id !== id )
       this.getAllBills()
       loader.dismiss()
      },err => {
        console.log(err)
        loader.dismiss()
      })
    })
  }


  searchedText() {
    this.searchedInitial = '';
    this.count = 0;
    if (this.search !== '') {
    this.searchedInitial = this.search.split(' ')[0].split('')[0].toUpperCase();
    }
    }

    paymentChange(event: {
      component: IonicSelectableComponent,
      value: any
    }) {
      this.selectedPaymentMode = event.value
      this.selectedPaymentModeName = event.value.name
      if(this.selectedPaymentModeName === 'All') {
        this.selectedPaymentModeName = ''
      }
      // this.getTotalSales()
      this.getAllBills();
    }
  
    employeeChange(event: {
      component: IonicSelectableComponent,
      value: any
    }) {
      this.selectedEmployee  =''
      this.selectedEmployee = event.value
      console.log(this.selectedEmployee);
      // this.getTotalSales()
      this.getAllBills()
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
