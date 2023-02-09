import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataArrayService {

  constructor() { }

  public slotArray = [
    { text: 'AM', value: '0-am' },
    { text: 'PM', value: '1-pm' }
  ];

  public minuteArray = [
    { text: '00', value: '0-00' },
    { text: '05', value: '1-05' },
    { text: '10', value: '2-10' },
    { text: '15', value: '3-15' },
    { text: '20', value: '4-20' },
    { text: '25', value: '5-25' },
    { text: '30', value: '6-30' },
    { text: '35', value: '7-35' },
    { text: '40', value: '8-40' },
    { text: '45', value: '9-45' },
    { text: '50', value: '10-50' },
    { text: '55', value: '11-55' },
    { text: '00', value: '12-00' }
  ];

  public timeArray = [
    { text: '1', value: '1' },
    { text: '2', value: '2' },
    { text: '3', value: '3' },
    { text: '4', value: '4' },
    { text: '5', value: '5' },
    { text: '6', value: '6' },
    { text: '7', value: '7' },
    { text: '8', value: '8' },
    { text: '9', value: '9' },
    { text: '10', value: '10' },
    { text: '11', value: '11' },
    { text: '12', value: '12' },
  ];




  getMinuteArray = () => {
    return this.minuteArray;
  }

  getTimeArray = () => {
    return this.timeArray;
  }

  getSlotArray = () => {
    return this.slotArray;
  }
}
