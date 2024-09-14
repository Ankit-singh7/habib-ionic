import { Component } from '@angular/core';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Platform, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { InvoiceService } from '../services/invoice/invoice.service';
import { RouterPage } from '../dashboard/router.page';
import { ActivatedRoute, Router } from '@angular/router';
import { generate } from 'shortid';
import * as moment from 'moment';
import { SubjectService } from '../services/subject/subject.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import domtoimage from 'dom-to-image';
import { ModeService } from '../services/mode/mode.service';
import { MenuService } from '../services/service/menu.service';
import { UserService } from '../services/user/user.service';
import { AppointmentService } from '../services/appointment/appointment.service';




@Component({
  selector: 'app-billing',
  templateUrl: './billing.page.html',
  styleUrls: ['./billing.page.scss'],

})
export class BillingPage extends RouterPage {

  public countryCode = '+91';
  public number = '7890891405';
  url: string = `https://wa.me/${this.countryCode}/${this.number}/?text=hi`
  public pdfObj = null;
  public selectedItems = [];
  public salonSelectedItems = [];
  public categoryList = [];
  public subCategoryList = [];
  public showDropDown = false;
  public arrowClass = "arrow-down";
  public date = new Date();
  public formattedDate = moment(this.date).format('DD/MM/yy');
  public name: string;
  public phone: string;
  public altPhone: string;
  public address: string;
  public selectedEmployee: any;
  public selectedPaymentMode: any;
  public selectedPaymentMode_1: any;
  public selectedPaymentMode_2: any;
  public formError = false;
  public message = '';
  public sessionId: any;
  public drawerBalance: any;
  public cashIncome: any;
  public billDetail: any;
  public emptyMessage = 'Please select a category'
  public totalInput = null
  public segment = 'services'
  public employeeList = [];
  public branchDetail;
  public billCount;

  payment = [];

  mode = []

  port: string;
  total = 0;
  item = 0;
  showCategory = true;
  showAmount = false;
  showPayment = false;
  showBill = false;
  showDualPayment = false;
  dual_payment = false;
  split_amount_1 = null
  split_amount_2 = null
  userName: any;
  netBanking = false;
  userId: any;
  role: any;
  branchId: any;
  branchName: any;
  executed = false;
  constructor(
    private platform: Platform,
    private invoiceService: InvoiceService,
    private menuService: MenuService,
    private modeService: ModeService,
    private loading: LoadingController,
    private subjectService: SubjectService,
    private appointmentService: AppointmentService,
    private alertController: AlertController,
    private router: Router,
    private socialSharing: SocialSharing,
    private userService: UserService,
    private toastController: ToastController,
    private route: ActivatedRoute) {
    super(router, route)
  }

  ionViewDidDestroy() {
    this.booking_amount = 0;
   }



  onEnter() {
    this.subjectService.getSessionId().subscribe((res) => {
      this.sessionId = res
    })


    this.subjectService.getFullName().subscribe((res) => {
      this.userName = res;
      this.subjectService.getUserId().subscribe((res) => {
        this.userId = res
        this.subjectService.getRole().subscribe((res) => {
          this.role = res
          this.subjectService.getBranchId().subscribe((res) => {
            this.branchId = res
            this.subjectService.getBranchName().subscribe((res) => {
              this.branchName = res
              if (!this.executed) {

                if (this.userName !== null && this.userId !== null && this.role !== null && this.branchId !== null && this.branchName !== null) {
                  this.hardRefresh();
                  this.getMostlyUsedProductList();
                  this.getMostlyUsedServiceList();
                  this.executed = true;
                }
              }

            })
          })
        })
      })
    })
  }

  async hardRefresh(event = null, hardRefresh = false) {
    let isDataMissing = false;
  
    if (!hardRefresh) {
      const paymentList = await this.subjectService.getLocalStorage('paymentListBilling');
      const employeeList = await this.subjectService.getLocalStorage('employeeList');
      const brandList = await this.subjectService.getLocalStorage('brandList');
      const serviceCategoryList = await this.subjectService.getLocalStorage('serviceCategoryList');
      const branchDetail = await this.subjectService.getLocalStorage('branchDetail');
      // Check if any data is missing
      if (paymentList === null || employeeList === null || brandList === null || serviceCategoryList === null || branchDetail === null) {
        isDataMissing = true;
      } else {
        // If all data is found, use it
        this.payment = paymentList;
        this.employeeList = employeeList;
        this.brandList = brandList
        this.serviceCategoryList = serviceCategoryList
        this.branchDetail = branchDetail
  
        // Complete the refresher if it was triggered
        if (event) {
          event.target.complete();
        }
  
        // Return early since we have all the cached data
        return;
      }
    }
  
    // If hardRefresh is true, or data is missing, call the API to refresh
    if (hardRefresh || isDataMissing) {
      await this.getPaymentList();
      await this.getBrand();
      await this.getAllEmployee();
      await this.getServiceCategory();
      await this.getBranchDetail(this.branchId);
    }
  
    // Complete the refresher if it was triggered
    if (event) {
      event.target.complete();
    }
  }


  ionViewDidLeave() {
    this.executed = false
  }

  async pasteTextFromClipboard() {
    try {
      const id = await navigator.clipboard.readText();
      this.appointmentId = id;
      const toast = await this.toastController.create({
        message: 'Text pasted from clipboard!',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      toast.present();
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Failed to read clipboard contents.',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      toast.present();
    }
  }

  getBranchDetail(id) {
    this.invoiceService.getBranchDetail(id).subscribe((res) => {
      if (res.data) {
        this.branchDetail = res.data
        this.subjectService.setLocalStorage('branchDetail', this.branchDetail)
      }
    })
  }



  getPaymentList() {
    this.modeService.getPaymentModeList().subscribe((res) => {
      this.payment = res.data.map((item) => ({
        id: item.payment_mode_id,
        name: item.payment_mode_name
      }))
    this.subjectService.setLocalStorage('paymentListBilling', this.payment);
    })
  }






  public selectServiceCategory: any;
  public selectedBrandCategory: any;
  categoryChange(event: {
    component: IonicSelectableComponent,
    value: any
  }, type) {

    if (type === 'service') {
      this.selectServiceCategory = event.value
      this.getServiceList(this.selectServiceCategory.service_type_id)

    } else if (type === 'product') {

      this.selectedBrandCategory = event.value
      this.getProductList(this.selectedBrandCategory.brand_id)

    }



  }

  paymentChange(event: {
    component: IonicSelectableComponent,
    value: any
  }, val) {
    if (val === 'payment_single') {
      this.selectedPaymentMode = ''
      this.selectedPaymentMode = event.value
    } else if (val === 'payment_1') {
      this.selectedPaymentMode_1 = ''
      this.selectedPaymentMode_1 = event.value
    } else if (val === 'payment_2') {
      this.selectedPaymentMode_2 = ''
      this.selectedPaymentMode_2 = event.value
    }
  }

  employeeChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this.selectedEmployee = ''
    this.selectedEmployee = event.value
  }


  billingEmployee(event: {
    component: IonicSelectableComponent,
    value: any
  }, item) {
    item.selected_employee = ''
    item.selected_employee = event?.value
    item.employee_id = event?.value?.user_id
    item.employee_name = event.value?.name
  }

  showEdit(val) {
    val.showIncrement = true
    this.total += val.price;
    this.item++;
    this.selectedItems.push(val)
    this.salonSelectedItems.push(val)
  }

  increment(val: any, type) {
    let tempObj = JSON.parse(JSON.stringify(val))
    this.salonSelectedItems.push(tempObj)
    val.count++
    this.total += val.price
    this.item++;
    if (type === 'service') {
      for (let item of this.selectedItems) {
        if (item?.service_id) {

          if (item.service_id === val.service_id) {
            item.count = val.count
          }
        } else {
          continue;
        }
      }
    } else if (type === 'product') {
      for (let item of this.selectedItems) {
        if (item?.product_id) {
          if (item.product_id === val.product_id) {
            item.count = val.count
          }

        } else {
          continue;
        }
      }
    }

  }

  decrement(val, type) {
    if (val.count !== 1) {
      val.count--
      this.total -= val.price
      this.item--;
      if (type === 'service') {
        for (let item of this.selectedItems) {
          if (item?.service_id) {

            if (item.service_id === val.service_id) {
              item.count = val.count

            }
          } else {
            continue;
          }
        }

        for (let i = 0; i < this.salonSelectedItems.length; i++) {
          if (this.salonSelectedItems[i].service_id) {
            if (this.salonSelectedItems[i].service_id === val.service_id) {
              this.salonSelectedItems.splice(i, 1)
              break;
            }
          }
        }

      } else if (type === 'product') {
        for (let item of this.selectedItems) {
          if (item?.product_id) {

            if (item.product_id === val.product_id) {
              item.count = val.count
            }
          } else {
            continue;
          }
        }

        for (let i = 0; i < this.salonSelectedItems.length; i++) {
          if (this.salonSelectedItems[i].product_id) {
            if (this.salonSelectedItems[i].product_id === val.product_id) {
              this.salonSelectedItems.splice(i, 1)
              break;
            }
          }
        }

      }


    } else {
      val.showIncrement = false;
      this.total -= val.price;
      this.item--;
      for (let i = 0; i < this.selectedItems.length; i++) {
        if (type === 'service') {
          if (this.selectedItems[i].service_id) {

            if (this.selectedItems[i].service_id === val.service_id) {
              this.selectedItems.splice(i, 1);
            }
          }
        } else if (type === 'product') {
          if (this.selectedItems[i].product_id) {

            if (this.selectedItems[i].product_id === val.product_id) {
              this.selectedItems.splice(i, 1);

            }
          }
        }
      }

      for (let i = 0; i < this.salonSelectedItems.length; i++) {
        if (type === 'service') {
          if (this.salonSelectedItems[i].service_id) {
            if (this.salonSelectedItems[i].service_id === val.service_id) {
              this.salonSelectedItems.splice(i, 1)
              break;
            }
          }

        } else if (type === 'product') {
          for (let i = 0; i < this.salonSelectedItems.length; i++) {
            if (this.salonSelectedItems[i].product_id) {
              if (this.salonSelectedItems[i].product_id === val.product_id) {
                this.salonSelectedItems.splice(i, 1)
                break;
              }
            }
          }
        }
      }
    }
  }

  async getBillCount(billId) {
    this.formError = false;
    this.message = ''
    this.billCount = 0;
    let loader = await this.loading.create({
      message: 'Please wait...',
    });

    loader.present().then(() => {
      this.invoiceService.getAllBill().subscribe((res) => {
        if (res.data?.result) {
          if (res.data?.result.length > 0) {
            let tempCount = res.data?.result.length + 1;
            if (tempCount <= 99) {

              this.billCount = ('0' + tempCount).slice(-2)
            } else {
              this.billCount = ('0' + tempCount).slice(-3)
            }
          } else {
            this.billCount = '01';
          }
          this.showGenerateBill(billId);
        } else {
          this.billCount = '01';
          this.showGenerateBill(billId);
          // this.message = 'Something Went Wrong. Please Retry.'
          // this.formError = true;
        }

        loader.dismiss()
      }, err => loader.dismiss())

    })
  }

  addTotal() {
    this.totalInput = 0;
    for (let item of this.salonSelectedItems) {
      if (item.total) {

        this.totalInput = this.totalInput + parseInt(item.total)
      }
    }

  }
  // For Service Related API

  public serviceCategoryList = [];
  async getServiceCategory() {
    let loader = await this.loading.create({
      message: 'Please wait...',
    });

    loader.present().then(() => {
      this.menuService.getAllServiceCatergory().subscribe((res) => {
        this.serviceCategoryList = res.data;
        loader.dismiss();
        this.subjectService.setLocalStorage('serviceCategoryList', this.serviceCategoryList);
      }, err => loader.dismiss())
    })

  }

  public brandList = [];
  async getBrand() {
    let loader = await this.loading.create({
      message: 'Please wait...',
    });

    loader.present().then(() => {
      this.menuService.getAllBrand().subscribe((res) => {
        this.brandList = res.data;
        this.subjectService.setLocalStorage('brandList', this.brandList);
        loader.dismiss();
      }, err => loader.dismiss())
    })

  }

  public serviceList = [];
  async getServiceList(id) {
    this.serviceList = [];
    let loader = await this.loading.create({
      message: 'Please wait...',
    });

    loader.present().then(() => {
      this.menuService.getServiceByCategory(id).subscribe((res) => {
        if (res.data) {

          this.serviceList = res.data.map((item) => ({
            ...item,
            'showIncrement': false,
            'count': 1,
            'selected_employee': null,
            'employee_id': null,
            'employee_name': '',
            'total': null
          }));

          for (let item of this.selectedItems) {
            if (item?.service_id) {
              for (let list of this.serviceList) {
                if (item.service_id === list.service_id) {
                  list.count = item.count
                  list.showIncrement = true
                  list.selected_employee = item.selected_employee
                  list.employee_id = item.employee_id
                  list.employee_name = item.employee_name
                } else {
                  continue;
                }

              }
            } else {
              continue;
            }
          }
        } else {
          this.emptyMessage = 'No items found.'
        }

        loader.dismiss();

      }, err => loader.dismiss())
    })
  }

  async getMostlyUsedServiceList() {
    let loader = await this.loading.create({
      message: 'Please wait...',
    });

    loader.present().then(() => {
      this.menuService.getActiveService().subscribe((res) => {
        if (res.data) {

          this.serviceList = res.data.map((item) => ({
            ...item,
            'showIncrement': false,
            'count': 1,
            'selected_employee': null,
            'employee_id': null,
            'employee_name': '',
            'total': null
          }));

          for (let item of this.selectedItems) {
            if (item?.service_id) {
              for (let list of this.serviceList) {
                if (item.service_id === list.service_id) {
                  list.count = item.count
                  list.showIncrement = true
                  list.selected_employee = item.selected_employee
                  list.employee_id = item.employee_id
                  list.employee_name = item.employee_name
                } else {
                  continue;
                }
              }
            } else {
              continue;
            }
          }
        } else {
          this.emptyMessage = 'No Mostly Used Service Added.'
        }

        loader.dismiss();

      }, err => loader.dismiss())
    })
  }

  // End Service related API


  // For Product related API


  public productList = [];
  async getProductList(id) {
    this.productList = [];
    let loader = await this.loading.create({
      message: 'Please wait...',
    });

    loader.present().then(() => {
      this.menuService.getProductByBrand(id).subscribe((res) => {
        if (res.data) {

          this.productList = res.data.map((item) => ({
            ...item,
            'showIncrement': false,
            'count': 1,
            'selected_employee': null,
            'employee_id': null,
            'employee_name': '',
            'total': null
          }));

          for (let item of this.selectedItems) {
            if (item?.product_id) {
              for (let list of this.productList) {
                if (item.product_id === list.product_id) {
                  list.count = item.count
                  list.showIncrement = true
                  list.selected_employee = item.selected_employee
                  list.employee_id = item.employee_id
                  list.employee_name = item.employee_name
                } else {
                  continue;
                }
              }
            } else {
              continue;
            }
          }
        } else {
          this.emptyMessage = 'No items found.'
        }

        loader.dismiss();

      }, err => loader.dismiss())
    })
  }

  async getMostlyUsedProductList() {

    this.menuService.getActiveProduct().subscribe((res) => {
      if (res.data) {

        this.productList = res.data.map((item) => ({
          ...item,
          'showIncrement': false,
          'count': 1,
          'selected_employee': null,
          'employee_id': null,
          'employee_name': '',
          'total': null
        }));

        for (let item of this.selectedItems) {
          if (item?.product_id) {
            for (let list of this.productList) {
              if (item.product_id === list.product_id) {
                list.count = item.count
                list.showIncrement = true
                list.selected_employee = item.selected_employee
                list.employee_id = item.employee_id
                list.employee_name = item.employee_name
              } else {
                continue;
              }
            }            
          } else {
            continue;
          }
        }
      } else {
        this.emptyMessage = 'No Mostly Used Products Added.'
      }



    })
  }


  // End Product related API


  // Get All Employee List

  getAllEmployee() {
    this.userService.getAllEmployee('status=Active').subscribe((res) => {
      if (res.data) {
        this.employeeList = res.data.result.map((item) => ({
          name: `${item.f_name} ${item.l_name}`,
          ...item

        }))
        this.subjectService.setLocalStorage('employeeList', this.employeeList);
      } else {
        this.employeeList = [];
      }
    })
  }
  toggleCategory() {
    this.getMostlyUsedProductList()
    this.getMostlyUsedServiceList()
    this.showCategory = true;
    this.showPayment = false;
    this.showAmount = false;
    this.showBill = false;
    this.showDualPayment = false
  }

  toggleAmount() {
    this.showCategory = false;
    this.showPayment = false;
    this.showAmount = true;
    this.showBill = false;
    this.showDualPayment = false;
  }

  togglePayment() {
    this.showCategory = false;
    this.showPayment = true;
    this.showAmount = false;
    this.showBill = false;
    this.showDualPayment = false
    this.dual_payment = false;
  }


  toggleBill() {
    this.showCategory = false;
    this.showPayment = false;
    this.showAmount = false;
    this.showBill = true;
    this.showDualPayment = false;
  }


  toggleSplitAmount() {
    this.showCategory = false;
    this.showPayment = false;
    this.showBill = false;
    this.showDualPayment = true
  }


  deleteSelectedItem(val) {
    if (val?.service_id) {


      this.salonSelectedItems = this.salonSelectedItems.filter(item => item.service_id !== val.service_id)
      for (let i = 0; i < this.selectedItems.length; i++) {
        if (this.selectedItems[i]?.service_id) {
          if (val.service_id === this.selectedItems[i].service_id) {
            this.total = this.total - (val.count * val.price)
            this.item = this.item - val.count
            this.selectedItems.splice(i, 1)


          }
        }
      }
      for (let list of this.serviceList) {
        if (val.service_id === list.service_id) {
          list.count = 1
          list.showIncrement = false
        } else {
          continue;
        }
      }
    } else if (val?.product_id) {
      this.salonSelectedItems = this.salonSelectedItems.filter(item => item.product_id !== val.product_id)
      for (let i = 0; i < this.selectedItems.length; i++) {
        if (this.selectedItems[i]?.product_id) {
          if (val.product_id === this.selectedItems[i].product_id) {
            this.total = this.total - (val.count * val.price)
            this.item = this.item - val.count
            this.selectedItems.splice(i, 1)

          }
        }
      }
      for (let i = 0; i <= this.salonSelectedItems.length; i++) {
        if (this.salonSelectedItems[i].product_id) {
          if (this.salonSelectedItems[i].product_id === val.product_id) {
            this.salonSelectedItems.splice(i, 1)
          }
        }
      }
      for (let list of this.productList) {
        if (val.product_id === list.product_id) {
          list.count = 1
          list.showIncrement = false
        } else {
          continue;
        }
      }
    }

  }

  incrementSelectedItem(val) {
    let tempObj = JSON.parse(JSON.stringify(val))
    this.salonSelectedItems.push(tempObj)
    val.count++
    this.item++
    this.total = this.total + val.price

    if (val?.service_id) {

      for (let list of this.serviceList) {
        if (val.service_id === list.service_id) {
          list.count = val.count

        } else {
          continue;
        }
      }
    } else if (val?.product_id) {
      for (let list of this.productList) {
        if (val.product_id === list.product_id) {
          list.count = val.count
        } else {
          continue;
        }
      }
    }

  }

  decrementSelectedItem(val) {
    if (val.count === 1) {
      this.deleteSelectedItem(val)
    } else {
      val.count--
      this.item--
      this.total = this.total - val.price
      if (val?.service_id) {

        for (let list of this.serviceList) {
          if (val.service_id === list.service_id) {
            list.count = val.count

          } else {
            continue;
          }
        }

        for (let i = 0; i < this.salonSelectedItems.length; i++) {
          if (this.salonSelectedItems[i].service_id) {
            if (this.salonSelectedItems[i].service_id === val.service_id) {
              this.salonSelectedItems.splice(i, 1)
              break;
            }
          }
        }
      } else if (val?.product_id) {

        for (let list of this.productList) {
          if (val.product_id === list.product_id) {
            list.count = val.count

          } else {
            continue;
          }
        }
        for (let i = 0; i < this.salonSelectedItems.length; i++) {
          if (this.salonSelectedItems[i].product_id) {
            if (this.salonSelectedItems[i].product_id === val.product_id) {
              this.salonSelectedItems.splice(i, 1)
              break;
            }
          }
        }
      }
    }
  }

  toggledropDown() {
    this.showDropDown = !this.showDropDown
    if (this.showDropDown === true) {
      this.arrowClass = 'arrow-up'
    } else {
      this.arrowClass = 'arrow-down'
    }
  }

  checkValidation() {
    this.formError = false;
    if (!this.selectedPaymentMode && !this.dual_payment) {
      this.message = 'Payment mode is required.'
      this.formError = true;
    } else if (!this.selectedPaymentMode_1 && !this.selectedPaymentMode_2 && this.dual_payment) {
      this.message = 'Please select both payment modes.'
      this.formError = true;
    } else if (!this.totalInput) {
      this.message = 'Total Bill Amount is required'
      this.formError = true;
    } else {
      this.formError = false;
      let billId = `CH-${generate()}`;
      if (this.appointmentId) {
        this.findCustomerBookingDetail(billId)
      } else {
        this.getBillCount(billId)
      }
    }

  }

  public booking_amount = 0;
  public appointmentId;
  async findCustomerBookingDetail(billId) {
    let loader = await this.loading.create({
      message: 'Finding Customer Details...',

    });

    loader.present().then(() => {

      this.appointmentService.getAppointmentDetail(this.appointmentId).subscribe((res) => {
        if (res.data) {
          this.booking_amount = res.data.booking_amount
          loader.dismiss()
        } else {
          this.booking_amount = 0;
          this.appointmentId = '';
        }
        this.getBillCount(billId)
        loader.dismiss()
      }, err => loader.dismiss())
    })
  }

  downloadPdf() {
    if (this.platform.is('cordova')) {

    } else {
      this.pdfObj.download();
    }
  }

  not_valid_employee = false
  checkEmployeeValidation() {
    for (let item of this.salonSelectedItems) {
      if (!item.employee_id && !item.employee_name) {
        this.not_valid_employee = true
        this.message = 'Please select employee'
      } else {
        this.not_valid_employee = false
        this.message = ''
      }
    }

    if (!this.not_valid_employee) {
      this.togglePayment()
    }

  }

  public PurchasedArr = [];
  public prodArr = [];
  public servArr = [];
  public displayServArr = [];
  public displayProdArr = [];

  async showGenerateBill(id) {
    let total;
    this.prodArr = [];
    this.servArr = [];
    this.displayServArr = [];
    this.displayProdArr = [];

    total = Number(this.totalInput) - this.booking_amount
    for (let item of this.salonSelectedItems) {
      if (item?.product_id) {
        let obj = {
          product_name: item.name,
          product_id: item.product_id,
          quantity: 1,
          total: item.total,
          employee_id: item.employee_id,
          employee_name: item.employee_name
        }
        this.prodArr.push(obj)
      } else if (item?.service_id) {
        let obj = {
          service_name: item.name,
          service_id: item.service_id,
          quantity: 1,
          total: item.total,
          employee_id: item.employee_id,
          employee_name: item.employee_name
        }

        this.servArr.push(obj)

      }
    }

    let smallname;
    if (this.name) {
      smallname = this.name.toLowerCase()
    } else {
      smallname = '';
    }
    let data;

    if (!this.dual_payment) {

      data = {
        bill_id: id,
        token_id: `LDC-${this.billCount}`,
        user_name: this.userName,
        user_id: this.userId,
        customer_name: smallname,
        customer_phone: this.phone,
        customer_alternative_phone: this.altPhone,
        customer_address: this.address,
        payment_mode_1: this.selectedPaymentMode?.name,
        employee_id: this.selectedEmployee?.user_id,
        employee_name: this.selectedEmployee?.name,
        branch_name: this.branchName,
        branch_id: this.branchId,
        total_price: this.totalInput,
        booking_amount: this.booking_amount,
        amount_to_be_paid: total,
        appointment_id: this.appointmentId,
        products: this.prodArr,
        services: this.servArr,
        dual_payment_mode: this.dual_payment

      }
    } else if (this.dual_payment) {
      data = {
        bill_id: id,
        token_id: `LDC-${this.billCount}`,
        user_name: this.userName,
        user_id: this.userId,
        customer_name: smallname,
        customer_phone: this.phone,
        customer_alternative_phone: this.altPhone,
        customer_address: this.address,
        payment_mode_1: this.selectedPaymentMode_1?.name,
        payment_mode_2: this.selectedPaymentMode_2?.name,
        employee_id: this.selectedEmployee?.user_id,
        employee_name: this.selectedEmployee?.name,
        branch_name: this.branchName,
        branch_id: this.branchId,
        split_amount_1: this.split_amount_1,
        split_amount_2: this.split_amount_2,
        total_price: parseInt(this.split_amount_1) + parseInt(this.split_amount_2),
        booking_amount: this.booking_amount,
        amount_to_be_paid: total,
        appointment_id: this.appointmentId,
        products: this.prodArr,
        services: this.servArr,
        dual_payment_mode: this.dual_payment

      }
    }



    this.billDetail = data;

    this.toggleBill();


  }


  updateDrawerBalance(bal, id) {
    let totalCashIncome = Number(bal) + Number(this.cashIncome)
    let drawerBalance = Number(this.drawerBalance) + Number(bal)
    const data = {
      cash_income: totalCashIncome,
      drawer_balance: drawerBalance
    }
    this.invoiceService.updateSession(data, id).subscribe((res) => {

    }, err => console.log(err))

  }



  getCurrentStatus() {


    if (this.role === 'operator') {
      let data = {

        branch_id: this.branchId,
        date: moment(new Date()).format('DD-MM-YYYY'),

      }
      let filterStr = '';
      for (let item in data) {
        if (data[item]) {
          filterStr = `${filterStr}${item}=${data[item]}&`
        }
      }
      this.invoiceService.getCurrentSession(filterStr).subscribe((res) => {
        if (res.data === null) {
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
    let alert = await this.alertController.create({
      header: 'Start your Session',
      subHeader: 'Enter an opening balance to start the day.',
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

            if (data.amount) {

              let loader = await this.loading.create({
                message: 'Please wait...',
              });

              loader.present().then(() => {


                const obj = {
                  session_status: 'true',
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
                }, err => {
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

  async createBill(data) {

    let loader = await this.loading.create({
      message: 'Please wait...',
      duration: 3000
    });

    loader.present().then(() => {
      this.invoiceService.createBill(data).subscribe((res) => {
        if (this.phone) {
          this.domToI()
          this.name = '';
          this.address = '',
            this.selectedPaymentMode = '';
          this.selectedEmployee = '';
          this.total = 0;
          this.item = 0;
          this.selectServiceCategory = ''
          this.selectedBrandCategory = ''
          this.selectedItems = [];
          this.subCategoryList = [];
          this.serviceList = [];
          this.productList = [];
          this.salonSelectedItems = [];
          this.appointmentId = '';
          this.booking_amount = 0;
          loader.dismiss()
        } else {
          this.phone = '';
          this.totalInput = null;
          this.toggleCategory();
          this.name = '';
          this.address = '',
            this.selectedPaymentMode = '';
          this.selectedEmployee = '';
          this.total = 0;
          this.item = 0;
          this.selectServiceCategory = ''
          this.selectedBrandCategory = ''
          this.selectedItems = [];
          this.subCategoryList = [];
          this.selectedItems = [];
          this.subCategoryList = [];
          this.serviceList = [];
          this.productList = [];
          this.salonSelectedItems = [];
          this.appointmentId = '';
          this.booking_amount = 0;
          loader.dismiss()
        }

        this.netBanking = false

      }, err => loader.dismiss())

      loader.dismiss()
    })


  }


  async domToI() {
    let loader = await this.loading.create({
      message: 'Generating Bill...',
    });

    loader.present().then(() => {

      let markup = document.getElementById('bill');
      domtoimage.toBlob(markup).then((blob) => {
        const name = new Date().getTime() + '.png';
        let form = new FormData()
        form.append('pdf', blob, name);
        this.invoiceService.uploadPdf(form).subscribe((res) => {
          if (res) {
            if (this.branchDetail.branch_id === 'Pr4sCmLyx' || this.branchDetail.branch_name === 'Hair Express Salon & Academy') {
              this.socialSharing.shareViaWhatsAppToReceiver(
                `+91${this.phone}`,
                `Hair Express Salon & Academy,\nplease click on the link below to view your bill and Save the number.\nBill Link: https://api.ahsalons.in/${res.path}\n\nThank You! Visit again\nEnjoyed our service? Leave us a review here: https://g.page/r/CQyJdm9pCn9zEAI/review`,
              );
            } else if (this.branchDetail.branch_id === 'fVj4BG0fF' || this.branchDetail.branch_name === 'Airport Habibb') {
              this.socialSharing.shareViaWhatsAppToReceiver(
                `+91${this.phone}`,
                `Airport Habibb,\nplease click on the link below to view your bill and Save the number.\nBill Link: https://api.ahsalons.in/${res.path}\n\nThank You! Visit again\nEnjoyed our service? Leave us a review here: https://g.page/r/Cc7xvDTs5ndKEAI/review`,
              );
            } else if (this.branchDetail.branch_id === 'KOhOskJLG' || this.branchDetail.branch_name === 'Sodepur Habibb') {
              this.socialSharing.shareViaWhatsAppToReceiver(
                `+91${this.phone}`,
                `Sodepur Habibb,\nplease click on the link below to view your bill and Save the number.\nBill Link: https://api.ahsalons.in/${res.path}\n\nThank You! Visit again\nEnjoyed our service? Leave us a review here: https://g.page/r/CYXEX55WmKCDEAI/review`,
              );
            } else if (this.branchDetail.branch_id === 'gW0vfq11U' || this.branchDetail.branch_name === 'A&h Salon & Academy') {
              this.socialSharing.shareViaWhatsAppToReceiver(
                `+91${this.phone}`,
                `A&h Salon & Academy,\nplease click on the link below to view your bill and Save the number.\nBill Link: https://api.ahsalons.in/${res.path}\n\nThank You! Visit again\nEnjoyed our service? Leave us a review here: https://g.page/r/CciUQ3KvCbzOEAI/review`,
              );
            } else if (this.branchDetail.branch_id === 'F9KZrn7vt' || this.branchDetail.branch_name === 'Hair Express Belghoria Salon And Academy') {
              this.socialSharing.shareViaWhatsAppToReceiver(
                `+91${this.phone}`,
                `Hair Express Belghoria Salon And Academy,\nplease click on the link below to view your bill and Save the number.\nBill Link: https://api.ahsalons.in/${res.path}\n\nThank You! Visit again\nEnjoyed our service? Leave us a review here: https://g.page/r/Cckxbz85-i8AEAI/review`,
              );
            } else {
              this.socialSharing.shareViaWhatsAppToReceiver(`+91${this.phone}`, `HABIB SALON,
            please click on the link below to view your bill and Save the number. Thank You Visit again`, `https://api.ahsalons.in/${res.path}`, `https://api.ahsalons.in/${res.path}`)
            }
            this.phone = '';
            this.toggleCategory();
            loader.dismiss()
          }
          loader.dismiss()
        })
      })
        .catch(function (error) {
          loader.dismiss()
        });
    })
  }

}
