import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AlertController, LoadingController, PickerController} from '@ionic/angular';
import { PickerOptions } from '@ionic/core';
import { DataArrayService } from '../services/data-array/data-array.service';
import { ModeService } from '../services/mode/mode.service';
import { SubjectService } from '../services/subject/subject.service';
import { AppointmentService } from '../services/appointment/appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterPage } from '../dashboard/router.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.page.html',
  styleUrls: ['./create-appointment.page.scss'],
})
export class CreateAppointmentPage extends RouterPage {

  public customer_name;
  public customer_whatsapp_number;
  public purpose;
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
  branchId;
  branchName;
  constructor(private picker: PickerController,
              private arrayService: DataArrayService,
              private subjectService: SubjectService,
              private loading: LoadingController,
              private appointmentService: AppointmentService,
              private modeService: ModeService, 
              private alertController: AlertController,   
              private router: Router,
              private socialSharing: SocialSharing,
              private route: ActivatedRoute) { 
                  super(router,route)
                this.subjectService.getBranchId().subscribe((res) => {
                  this.branchId = res
                })
          
                this.subjectService.getBranchName().subscribe((res) => {
                  this.branchName = res
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


  getDates(startDate, stopDate) {
    let i = 0;
    var currentDate = moment(startDate);
    var endDate = moment(stopDate);
    while (currentDate <= endDate) {

      this.dateArray.push({ value: `${i}.${moment(currentDate).format('DD-MM-YYYY')}`, text: moment(currentDate).format('ddd MMM D') })
      currentDate = moment(currentDate).add(1, 'days');
      i = i + 1;
    }
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
      this.selected_date = col.options[col.selectedIndex].value.split('.')[1];
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
      this.selectedStartHour = col1.options[col1.selectedIndex].text;
      this.eventStartMinuteIndex = col2.options[col2.selectedIndex].value.split('-')[0];
      this.selectedStartMin = col2.options[col2.selectedIndex].text;
      this.eventStartSlotIndex = col3.options[col3.selectedIndex].value.split('-')[0];
      this.selectedStartSlot = col3.options[col3.selectedIndex].text;
      this.startTime = `${this.selectedStartHour}:${this.selectedStartMin} ${this.selectedStartSlot}`;
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

        this.selected_payment = col.options[col.selectedIndex].text;
      }
      picker.columns.forEach(col => { col.options.forEach(el => { delete el.selected; delete el.duration; delete el.transform; }) })
    })
  }


  public message;
  async createAppointment(){
    if(this.amount && !this.selected_payment) {
      this.message = 'Please select the payment option';
    } else if (this.selected_payment && !this.amount) {
      this.message = 'Please give the booking amount if payment mode is selected';
    } else {
      let loader = await this.loading.create({
        message: 'Please wait...',
      });
  
      loader.present().then(() => {
        
        const data = {
          appointment_date:  this.selected_date,
          appointment_time: this.startTime,
          customer_name: this.customer_name,
          purpose: this.purpose,
          branch_id: this.branchId,
          branch_name: this.branchName,
          payment_mode: this.selected_payment,
          booking_amount: this.amount?this.amount:0
         }
  
        this.appointmentService.createAppointment(data).subscribe((res) => {
          if (this.branchId === 'Pr4sCmLyx' || this.branchName === 'Hair Express Salon & Academy') {
            this.socialSharing.shareViaWhatsAppToReceiver(
              `+91${this.customer_whatsapp_number}`,
              this.generateMessage('Hair Express Salon & Academy')
            );
          } else if (this.branchId === 'fVj4BG0fF' || this.branchName === 'Airport Habibb') {
            this.socialSharing.shareViaWhatsAppToReceiver(
              `+91${this.customer_whatsapp_number}`,
              this.generateMessage('Airport Habibb')
            );
          } else if (this.branchId === 'KOhOskJLG' || this.branchName === 'Sodepur Habibb') {
            this.socialSharing.shareViaWhatsAppToReceiver(
              `+91${this.customer_whatsapp_number}`,
              this.generateMessage('Sodepur Habibb')
            );
          } else if (this.branchId === 'gW0vfq11U' || this.branchName === 'A&h Salon & Academy') {
            this.socialSharing.shareViaWhatsAppToReceiver(
              `+91${this.customer_whatsapp_number}`,
              this.generateMessage('A&h Salon & Academy')
            );
          } else if (this.branchId === 'F9KZrn7vt' || this.branchName === 'Hair Express Belghoria Salon And Academy') {
            this.socialSharing.shareViaWhatsAppToReceiver(
              `+91${this.customer_whatsapp_number}`,
              this.generateMessage('Hair Express Belghoria Salon And Academy')
            );
          } else {
            this.socialSharing.shareViaWhatsAppToReceiver(`+91${this.customer_whatsapp_number}`,
              this.generateMessage('HABIB SALON')
            );
          }
          this.router.navigate(['/con/appointment-list'])
          loader.dismiss()
        }, err => loader.dismiss())
      })
    }

  }

  generateMessage(salon_name) {
     if(this.amount && this.amount !== 0) {
       return  `${salon_name} \nDear ${this.customer_name}, \nYour appointment has been successfully booked for ${this.selected_date} at ${this.startTime}. An advance payment of Rs ${this.amount} has been received. \nThank you for choosing our salon. We look forward to serving you!`
     } else {
      return  `${salon_name} \nDear ${this.customer_name}, \nYour appointment has been successfully booked for ${this.selected_date} at ${this.startTime}.\nThank you for choosing our salon. We look forward to serving you!`
     }
  }



}
