import { Component, OnInit } from '@angular/core';
import { LoadingController, PickerController} from '@ionic/angular';
import { PickerOptions } from '@ionic/core';
import { InvoiceService } from '../services/invoice/invoice.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AppointmentService } from '../services/appointment/appointment.service';
import { RouterPage } from '../dashboard/router.page';
import { ModeService } from '../services/mode/mode.service';
import { DataArrayService } from '../services/data-array/data-array.service';
import { getLocaleDateFormat } from '@angular/common';

@Component({
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.page.html',
  styleUrls: ['./appointment-edit.page.scss'],
})
export class AppointmentEditPage extends RouterPage {

  public appointmentId;
  public detail = {
    appointment_id:'',
    appointment_date:'',
    appointment_time: '',
    booking_amount: 0,
    customer_name: '',
    payment_mode: '',
    purpose: ''
  }
  public selected_date;
  public selected_show_date;
  public expected_time;
  public amount;
  public date = new Date();
  public startDate = moment(this.date).format('YYYY/MM/DD');
  public stopDate = moment(this.date.setDate(new Date().getDate() + 120)).format('YYYY/MM/DD')
  public dateArray = [];
  public paymentMode = [];
  public dateIndex: any;
  public slotArray = [];
  public minuteArray = [];
  public timeArray = [];
  eventStartHourIndex: number;
  eventStartMinuteIndex: number;
  eventStartSlotIndex: number;
  selectedStartHour: string;
  selectedStartMin: string;
  selectedStartSlot: string;
  startTime: string;

  constructor(
    private picker: PickerController,
    private invoiceService: InvoiceService,
    private loading: LoadingController,
    private appointmentService: AppointmentService,
    private router: Router,
    private arrayService: DataArrayService,
    private modeService: ModeService,
    private route: ActivatedRoute) { 
      super(router,route)
      this.route.queryParams.subscribe(params => {
           this.appointmentId = params['id'];
           this.getAppointmentDetails(this.appointmentId)
      })

    }

  ionViewDidEnter(){
    this.getDates(this.startDate,this.stopDate)
    this.slotArray = this.arrayService.getSlotArray();
    this.minuteArray = this.arrayService.getMinuteArray();
    this.timeArray = this.arrayService.getTimeArray();
    this.getPaymentList()
  }

  onEnter(){

  }

  async getAppointmentDetails(id){
    let loader = await this.loading.create({
      message: 'Please wait...',
    });

    loader.present().then(() => {
      
      this.appointmentService.getAppointmentDetail(id).subscribe((res) => {
        if(res.data) {
          
          this.detail.appointment_id = res.data.appointment_id
          this.selected_show_date = moment(res.data.appointment_date).format('ddd MMM D')
          this.detail.appointment_date  = res.data.appointment_date
          this.detail.appointment_time = res.data.appointment_time
          this.detail.customer_name = res.data.customer_name
          this.detail.booking_amount = res.data.booking_amount?res.data.booking_amount:0
          this.detail.purpose = res.data.purpose
          this.detail.payment_mode = res.data.payment_mode
        }
        loader.dismiss()
      },err => loader.dismiss())
    })
  }



  getDates(startDate, stopDate) {
    let i = 0;
    var currentDate = moment(startDate);
    var endDate = moment(stopDate);
    while (currentDate <= endDate) {

      this.dateArray.push({ value: `${i}.${moment(currentDate).format('DD-MM-YYYY')}`, text: moment(currentDate).format('ddd MMM D') })
      currentDate = moment(currentDate).add(1, 'days');
      i = i + 1;
    }
    console.log(this.dateArray);
    return this.dateArray;
  }

  payment = [];
  getPaymentList(){
    this.modeService.getPaymentModeList().subscribe((res) => {
      let tempPayment = res.data.map((item) => ({
        id: item.payment_mode_id,
        text: item.payment_mode_name
      }))

      let obj = {
        id: '',
        text: 'None'
      }

      this.payment = [obj,...tempPayment]
    })
  }


  async showDate() {
    let opts: PickerOptions = {
      mode: 'ios',
      cssClass: 'cus-item',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'

        },
        {
          text: 'Done'
        }

      ],
      columns: [
        {
          name: 'Date',
          options: this.dateArray,
          selectedIndex: this.dateIndex
        }
      ]
    };
    let picker = await this.picker.create(opts);
    picker.present();
    picker.onDidDismiss().then(async data => {

      let col = await picker.getColumn('Date');
      this.selected_show_date = col.options[col.selectedIndex].text;
      this.detail.appointment_date = col.options[col.selectedIndex].value.split('.')[1];
      this.dateIndex = col.options[col.selectedIndex].value.split('.')[0];
      picker.columns.forEach(col => { col.options.forEach(el => { delete el.selected; delete el.duration; delete el.transform; }) })
    })
  }


  async showEventStartTime() {
    let opts: PickerOptions = {
      mode: 'ios',
      cssClass: 'cus-date',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'

        },
        {
          text: 'Done'
        }

      ],
      columns: [
        {
          name: 'Hour',
          options: this.timeArray,
          selectedIndex: this.eventStartHourIndex - 1

        },
        {
          name: 'Min',
          options: this.minuteArray,
          selectedIndex: this.eventStartMinuteIndex

        },
        {
          name: 'Slot',
          options: this.slotArray,
          selectedIndex: this.eventStartSlotIndex

        }
      ]
    };
    let picker = await this.picker.create(opts);
    picker.present();
    picker.onDidDismiss().then(async data => {

      let col1 = await picker.getColumn('Hour');
      let col2 = await picker.getColumn('Min');
      let col3 = await picker.getColumn('Slot');

      this.eventStartHourIndex = col1.options[col1.selectedIndex].value.split('-')[0];
      console.log('hour', this.eventStartHourIndex)
      this.selectedStartHour = col1.options[col1.selectedIndex].text;
      this.eventStartMinuteIndex = col2.options[col2.selectedIndex].value.split('-')[0];
      console.log('minute', this.eventStartMinuteIndex)
      this.selectedStartMin = col2.options[col2.selectedIndex].text;
      this.eventStartSlotIndex = col3.options[col3.selectedIndex].value.split('-')[0];
      console.log('slot', this.eventStartSlotIndex)
      this.selectedStartSlot = col3.options[col3.selectedIndex].text;
      this.detail.appointment_time = `${this.selectedStartHour}:${this.selectedStartMin} ${this.selectedStartSlot}`;
      picker.columns.forEach(col => { col1.options.forEach(el => { delete el.selected; delete el.duration; delete el.transform; }) })
      picker.columns.forEach(col => { col2.options.forEach(el => { delete el.selected; delete el.duration; delete el.transform; }) })
      picker.columns.forEach(col => { col3.options.forEach(el => { delete el.selected; delete el.duration; delete el.transform; }) })
    })
  }

  public selected_payment;
  async showPayment() {
    let opts: PickerOptions = {
      mode: 'ios',
      cssClass: 'cus-item',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'

        },
        {
          text: 'Done'
        }

      ],
      columns: [
        {
          name: 'payment',
          options: this.payment
        }
      ]
    };
    let picker = await this.picker.create(opts);
    picker.present();
    picker.onDidDismiss().then(async data => {

      let col = await picker.getColumn('payment');
      if(col.options[col.selectedIndex].text === 'None') {
        this.selected_payment = ''
      } else {

        this.detail.payment_mode = col.options[col.selectedIndex].text;
      }
      picker.columns.forEach(col => { col.options.forEach(el => { delete el.selected; delete el.duration; delete el.transform; }) })
    })
  }


  async editAppointment(){

    let loader = await this.loading.create({
      message: 'Please wait...',
    });

    loader.present().then(() => {
      this.appointmentService.editAppointment(this.detail,this.detail.appointment_id).subscribe((res) => {
        this.router.navigate(['/con/appointment-list'])
        loader.dismiss()
    },err => loader.dismiss())

          
    })

  }

}
