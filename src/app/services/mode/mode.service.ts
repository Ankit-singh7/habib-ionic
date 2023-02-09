import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment'
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ModeService {

  constructor(private http: HttpClient) { }

  // Payment apis

  getPaymentModeList = (): Observable<any> =>  {
    return this.http.get(`${environment.apiURL}/payment`)
  }

  createPaymentMode = (data): Observable<any> => {
    return this.http.post(`${environment.apiURL}/payment/create`,data)
  }

  getPaymentModeDetail = (id): Observable<any> => {
    return this.http.get(`${environment.apiURL}/payment/${id}/getById`)
  }

  updatePaymentMode = (id,data): Observable<any> =>{
    return this.http.put(`${environment.apiURL}/payment/${id}/update`,data)
  }

  deletePaymentMode = (id): Observable<any> => {
    return this.http.get(`${environment.apiURL}/payment/${id}/delete`)
  }


  //Delivery apis
  getDeliveryModeList = (): Observable<any> =>  {
    return this.http.get(`${environment.apiURL}/delivery/view/all`)
  }

  createDeliveryMode = (data): Observable<any> => {
    return this.http.post(`${environment.apiURL}/delivery/create`,data)
  }

  getDeliveryModeDetail = (id): Observable<any> => {
    return this.http.get(`${environment.apiURL}/delivery/${id}/getById`)
  }

  updateDeliveryMode = (id,data): Observable<any> =>{
    return this.http.put(`${environment.apiURL}/delivery/${id}/update`,data)
  }

  deleteDeliveryMode = (id): Observable<any> => {
    return this.http.get(`${environment.apiURL}/delivery/${id}/delete`)
  }

}
