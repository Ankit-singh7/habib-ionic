import { Component } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { InvoiceService } from '../services/invoice/invoice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterPage } from '../dashboard/router.page';
import * as moment from 'moment';
import { SubjectService } from '../services/subject/subject.service';
import { ModeService } from '../services/mode/mode.service';
import { UserService } from '../services/user/user.service';


@Component({
  selector: 'app-employee-wise-sales',
  templateUrl: './employee-wise-sales.page.html',
  styleUrls: ['./employee-wise-sales.page.scss'],
})
export class EmployeeWiseSalesPage extends RouterPage{

  public billArray = [];
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
                this.getAllBills()
                this.getPaymentList();
                this.getAllEmployee()
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
  this.payment = [];
  this.mode = [];
  this.selectedPaymentMode = '';
  this.selectedEmployee = '';
  this.executed = false;
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

  async getAllBills() {
    
  let loader = await this.loading.create({
    message: 'Please wait...',
  });
  let data = {
    payment_mode: this.selectedPaymentModeName,
    branch_id: this.branchId,
    employee_id: this.selectedEmployee?.user_id
   }
   let filterStr = '';
   for (let item in data) {
      if(data[item]) {
        filterStr = `${filterStr}${item}=${data[item]}&`
      }
      }
  loader.present().then(() => {
    this.invoiceService.getAllBill(filterStr).subscribe((res) => {
      this.billArray = [];
      if(res.data) {
        let listData = []
        let updatedArray = []
        listData = res.data.result.map((item) => ({
             date: moment(item.createdOn).format('YYYY-MM-DD'),
             services: [...item.services],
             products: [...item.products],
             total_price: item.total_price
        }))
        for(let item of listData) {
          if(item.services.length>0) {
            for(let s of item.services) {
              let obj = {
                employee_name: s.employee_name,
                quantity: s.quantity,
                type: 'service',
                s_name: s.service_name,
                price: s.total
              }
  
              updatedArray.push(obj)
  
            }
          }
          if(item.products.length>0) {
            for(let s of item.products) {
              let obj = {
                employee_name: s.employee_name,
                quantity: s.quantity,
                type: 'product',
                p_name: s.product_name,
                price: s.total
              }
  
              updatedArray.push(obj)
  
            }
          }
        }
  
        let temp_array = JSON.parse(JSON.stringify(updatedArray))
        this.billArray = temp_array.reduce((items,item)=> {
          let itemIndex = items.findIndex((i) => i.employee_name === item.employee_name)
          if(itemIndex === -1) {
            if(item.type === 'service') {
                item.service_quantity = item.quantity
                item.product_quantity = 0
                item.total_price = item.price
                item.s_price = item.price
                item.p_price = 0
                delete item.quantity
                delete item.type
                delete item.price
                items.push(item);
            } 
            if(item.type === 'product') {
              item.product_quantity = item.quantity
              item.service_quantity = 0
              item.s_price = 0
              item.total_price = item.price
              item.p_price = item.price
              delete item.quantity
              delete item.type
              delete item.price
              items.push(item);
          }
          } else {
            if(items[itemIndex].service_quantity && item.type === 'service') {
               items[itemIndex].total_price += item.price
               items[itemIndex].service_quantity +=  item.quantity
               items[itemIndex].s_price = `${items[itemIndex].s_price} + ${item.price}`
               items[itemIndex].s_name = `${items[itemIndex].s_name},${item.s_name}`
            } else if(items[itemIndex].product_quantity && item.type === 'product') {
              items[itemIndex].total_price += item.price
              items[itemIndex].product_quantity +=  item.quantity
              items[itemIndex].p_price = `${items[itemIndex].p_price} + ${item.price}`
              items[itemIndex].p_name = `${items[itemIndex].p_name},${item.p_name}`
            } else if(!items[itemIndex].service_quantity && item.type === 'service') {
              items[itemIndex].total_price += item.price
              items[itemIndex].service_quantity =  item.quantity
              items[itemIndex].s_price = item.price
              items[itemIndex].s_name =  item.s_name
            } else if(!items[itemIndex].product_quantity && item.type === 'product') {
              items[itemIndex].total_price += item.price
              items[itemIndex].product_quantity =  item.quantity
              items[itemIndex].p_price = item.price
              items[itemIndex].p_name =  item.p_name
            } 
          }
  
          return items;
  
        },[])
      } 
      loader.dismiss();
    },(err) => loader.dismiss())

  })
}

goToSales(item) {
  this.router.navigate(['/con/employee-sales-details', {data:JSON.stringify(item)}])
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
      this.getAllBills();
    }
  
    employeeChange(event: {
      component: IonicSelectableComponent,
      value: any
    }) {
      this.selectedEmployee  =''
      this.selectedEmployee = event.value
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
