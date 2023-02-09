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
  selector: 'app-product-sales',
  templateUrl: './product-sales.page.html',
  styleUrls: ['./product-sales.page.scss'],
})
export class ProductSalesPage extends RouterPage{

  public search = '';

  public count = 0;
  public selectedEmployee: any;


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
  startDate ;
  endDate ;

  startDateOption: any;
  endDateOption: any;
  selectedPaymentMode: string;
  searchedInitial: string;
  


  constructor(
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

                this.getAllReport()

                this.getCurrentStatus();

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
  this.selectedEmployee = '';
  this.executed = false;
}

onDateChange() {
  if(this.startDate && this.endDate) {
    let d1 = moment(this.startDate, 'DD-MM-YYYY').valueOf()
    let d2 = moment(this.endDate, 'DD-MM-YYYY').valueOf()
    if(d1<=d2) {
      console.log('here')
      this.getAllReport()
    } else {
        this.dateComparePopup()
    }
  } else if(!this.startDate && !this.endDate) {
    this.getAllReport()
  }
}

  reportList = [];
  async getAllReport() {
   
  let data = {
    startDate: this.startDate?this.startDate:moment(new Date()).format('DD-MM-YYYY'),
    endDate: this.endDate?this.endDate:moment(new Date()).format('DD-MM-YYYY'),
    branch_id: this.selectedBranch?.id,
    employee_id: this.selectedEmployee?.user_id
   }
   let filterStr = '';
   for (let item in data) {
      if(data[item]) {
        filterStr = `${filterStr}${item}=${data[item]}&`
      }
      }
      let loader = await this.loading.create({
        message: 'Please wait...',
        duration: 2000
      });
  
      loader.present().then(() => {

        this.invoiceService.getAllProductSalesReport(filterStr).subscribe((res) => {
          this.reportList = [];
          if(res?.data?.result) {
            let arr1 = JSON.parse(JSON.stringify(res.data.result))
            let keyArr = arr1.map((i) => i.service_id)
            console.log(keyArr)
           for(let i = 0; i< arr1.length;i++) {
            //  debugger
             let tempArr = arr1.filter((item) => item.product_id === arr1[i].product_id)
             console.log(tempArr)
             if(tempArr.length>1) {
               let newObj = JSON.parse(JSON.stringify(tempArr[0]))
               let quantity = 0;
               for(let j = 0; j<tempArr.length;j++) {
                 quantity = quantity + tempArr[j].quantity
               }
               newObj.quantity = quantity;
               if(!this.reportList.some(item => item.product_id === newObj.product_id )) {
      
                 this.reportList.push(Object.assign({}, newObj))
               } 
             } else {
               this.reportList.push(tempArr[0])
               this.loading.dismiss()
             }
           }
          //  this.totalPage = this.reportList.length;
      
         console.log(this.reportList)
         this.loading.dismiss()
          }
           this.loading.dismiss()
        }, err => {
          this.loading.dismiss()
        })
      })
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





  branchChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.selectedBranch = event.value

    // this.getTotalSales()
    this.getAllReport();
  }





  searchedText() {
    this.searchedInitial = '';
    this.count = 0;
    if (this.search !== '') {
    this.searchedInitial = this.search.split(' ')[0].split('')[0].toUpperCase();
    }
    }


  
    employeeChange(event: {
      component: IonicSelectableComponent,
      value: any
    }) {
      this.selectedEmployee  =''
      this.selectedEmployee = event.value
      console.log(this.selectedEmployee);
      // this.getTotalSales()
      this.getAllReport()
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
