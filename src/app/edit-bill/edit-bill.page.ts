import { Component, OnInit } from '@angular/core';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Platform, LoadingController } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File,FileEntry, IWriteOptions } from '@ionic-native/file/ngx';
import { InvoiceService } from '../services/invoice/invoice.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import domtoimage from 'dom-to-image';
import { UserService } from '../services/user/user.service';
import { RouterPage } from '../dashboard/router.page';
import { SubjectService } from '../services/subject/subject.service';
@Component({
  selector: 'app-edit-bill',
  templateUrl: './edit-bill.page.html',
  styleUrls: ['./edit-bill.page.scss'],
})
export class EditBillPage extends RouterPage {

  public billId:any;
  public billDetail: any;
  public selectedItems = [];
  public categoryList = [];
  public subCategoryList = [];
  public selectedCategory:any;
  public showDropDown = false;
  public arrowClass = "arrow-down";
  public formattedDate;
  public name:string;
  public phone: string;
  public altPhone: string;
  public address: string;
  public selectedEmployee:any;
  public selectedPaymentMode: any;
  public selectedPaymentMode_2: any;
  public formError = false;
  public message = '';
  public sessionId:any;
  public drawerBalance: any;
  public cashIncome:any;
  netBanking = false;
  showDetail = true;
  dual_payment = false;
  payment = [
    { id: 1, name: 'Cash' },
    { id: 2, name: 'GooglePay' },
    { id: 3, name: 'PhonePe' },
    { id: 4, name: 'Card' },
    { id: 5, name: 'PayTm' }
  ];

  mode = [
    { id: 1, name: 'Home Delivery' },
    { id: 2, name: 'Parcel' },
    { id: 3, name: 'Dine-In' },
    { id: 4, name: 'Swiggy' },
    { id: 5, name: 'Zomato' }
  ]
  branchDetail: any;
  branchId: any;
  constructor(private platform: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private invoiceService: InvoiceService,
    private loading: LoadingController,
    private router: Router,
    private userService: UserService,
    private socialSharing: SocialSharing,
    private subjectService: SubjectService,
    private route: ActivatedRoute) { 
      super(router,route)
      this.route.queryParams.subscribe(params => {
           this.billId = params['id'];
           this.getBillDetail(this.billId)
          
      })
      this.subjectService.getBranchId().subscribe((res) => {
        this.branchId = res
        this.getBranchDetail(this.branchId)
      })
    }

  ngOnInit() {
  }


  onDualChange(){
    console.log(this.dual_payment)
  }


  ionViewDidEnter(){
    this.getAllEmployee()
  }

  onEnter(){

  }


  async getBillDetail(id){
    let loader = await this.loading.create({
      message: 'Please wait...',
    });

    loader.present().then(() => {
      
      this.invoiceService.getBillDetail(id).subscribe((res) => {
      if(res.data) {
        this.billDetail = res.data
        if(this.billDetail.dual_payment_mode === 'true') {
          this.dual_payment = true
        } else {
          this.dual_payment = false
        }
        if(this.billDetail.payment_mode === 'Net Banking') {
          this.selectedPaymentMode = {id:0,name:'Net Banking'}
        } else if(this.billDetail.payment_mode === 'Cash') {
          this.selectedPaymentMode = {id:1,name:'Cash'}
        } else if(this.billDetail.payment_mode === 'GooglePay') {
          this.selectedPaymentMode = {id:2,name:'GooglePay'}
        } else if(this.billDetail.payment_mode === 'PhonePe') {
          this.selectedPaymentMode = {id:3,name:'PhonePe'}
        } else if(this.billDetail.payment_mode === 'Card') {
          this.selectedPaymentMode = {id:4,name:'Card'}
        }else if(this.billDetail.payment_mode === 'PayTm') {
          this.selectedPaymentMode = {id:5,name:'PayTm'}
        }


        if(this.billDetail.payment_mode_2 === 'Net Banking') {
          this.selectedPaymentMode_2 = {id:0,name:'Net Banking'}
        } else if(this.billDetail.payment_mode_2 === 'Cash') {
          this.selectedPaymentMode_2 = {id:1,name:'Cash'}
        } else if(this.billDetail.payment_mode_2 === 'GooglePay') {
          this.selectedPaymentMode_2 = {id:2,name:'GooglePay'}
        } else if(this.billDetail.payment_mode_2 === 'PhonePe') {
          this.selectedPaymentMode_2 = {id:3,name:'PhonePe'}
        } else if(this.billDetail.payment_mode_2 === 'Card') {
          this.selectedPaymentMode_2 = {id:4,name:'Card'}
        }else if(this.billDetail.payment_mode_2 === 'PayTm') {
          this.selectedPaymentMode_2 = {id:5,name:'PayTm'}
        }



        this.selectedEmployee  = {user_id: this.billDetail.employee_id, name: this.billDetail.employee_name}


        console.log('payment', this.selectedPaymentMode)



        this.formattedDate = moment(res.data.createdOn).format('DD/MM/yy');
      }
      loader.dismiss()
      }, err => loader.dismiss())
    })
  }

  public employeeList = [];
  getAllEmployee(){
    this.userService.getAllEmployee().subscribe((res) => {
       if(res.data.result) {
         this.employeeList = res.data.result.map((item) => ({
           name: `${item.f_name} ${item.l_name}`,
           ...item
  
         }))
      
       } else {
         this.employeeList = [];
       }
    })
  }

  getBranchDetail(id) {
    this.invoiceService.getBranchDetail(id).subscribe((res) => {
      if(res.data) {
        this.branchDetail = res.data
      }
    })
  }


  employeeChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.selectedEmployee  =''
    this.selectedEmployee = event.value
    console.log(this.selectedEmployee);
  }


    paymentChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.selectedPaymentMode  =''
    this.selectedPaymentMode = event.value
  }






  async editBill(){
    let loader = await this.loading.create({
      message: 'Please wait...',
    });

    loader.present().then(() => {
      if(this.dual_payment){

        this.billDetail.payment_mode = this.selectedPaymentMode.name
        this.billDetail.payment_mode_2 = this.selectedPaymentMode_2.name
        this.billDetail.employee_id = this.selectedEmployee.user_id
        this.billDetail.employee_name = this.selectedEmployee.name
        this.billDetail.customer_name = this.billDetail.customer_name.toLowerCase()
        this.billDetail.dual_payment_mode = this.dual_payment
      } else {
        this.billDetail.payment_mode = this.selectedPaymentMode.name
        this.billDetail.employee_id = this.selectedEmployee.user_id
        this.billDetail.employee_name = this.selectedEmployee.name
        this.billDetail.customer_name = this.billDetail.customer_name.toLowerCase()
        this.billDetail.dual_payment_mode = this.dual_payment
      }
      this.invoiceService.updateBill(this.billDetail,this.billId).subscribe((res) => {
        this.router.navigate(['/con/billing-list'])
        loader.dismiss()
      },err=> {
        loader.dismiss()
      })
    }) 
  }

  async editandSendBill(){
    let loader = await this.loading.create({
      message: 'Please wait...',
    });

    loader.present().then(() => {
      this.billDetail.payment_mode = this.selectedPaymentMode.name
      this.billDetail.employee_id = this.selectedEmployee.user_id
      this.billDetail.employee_name = this.selectedEmployee.name
      this.invoiceService.updateBill(this.billDetail,this.billId).subscribe((res) => {
        this.domToI()
  
        loader.dismiss()
      },err=> {
        loader.dismiss()
      })
    }) 
  }


  async domToI(){
    let loader = await this.loading.create({
      message: 'Generating Bill...',
    });

    loader.present().then(() => {
      
      let markup = document.getElementById('bill');
       domtoimage.toBlob(markup).then((blob) => {
        const name = new Date().getTime() + '.png';
         console.log(blob)
        let form = new FormData()
        form.append('pdf', blob, name);
        this.invoiceService.uploadPdf(form).subscribe((res) => {
          console.log('here')
           if(res) { 
             this.socialSharing.shareViaWhatsAppToReceiver(`+91${this.billDetail.customer_phone}`,`HABIB SALON,
             please click the link below to see your bill. Thank You Visit again`,`https://api.ahsalons.in/${res.path}`, `https://api.ahsalons.in/${res.path}`)
             this.phone = '';
             this.router.navigate(['/con/billing-list'])
             loader.dismiss()
           }
           loader.dismiss()
        })
      })
       .catch(function (error) {
        console.error('oops, something went wrong!', error);
        loader.dismiss()
        });
    })
  }




}
