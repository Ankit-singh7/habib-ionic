import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment'
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { SubjectService } from '../subject/subject.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  public date = new Date();
  public formattedDate = moment(this.date).format('DD-MM-YYYY');
  public branchId;

  constructor(private http: HttpClient, private subjectService: SubjectService) { 
    this.subjectService.getBranchId().subscribe((res) => {
      this.branchId = res
    })

  }


  public getAppointmentList(paramStr?:any):Observable<any> {
    let str = paramStr?paramStr:''
    return this.http.get(`${environment.apiURL}/appointment?per_page=500&current_page=1&status=pending&${str}`);
  }

  public createAppointment(data): Observable<any> {
    return this.http.post(`${environment.apiURL}/appointment`,data)
  }

  public getAppointmentDetail(appointment_id): Observable<any> {
     return this.http.get(`${environment.apiURL}/appointment/${appointment_id}`)
  } 

  public editAppointment(data, appointment_id): Observable<any>{
    return this.http.put(`${environment.apiURL}/appointment/${appointment_id}`, data)
  }

  public deleteAppointment(appointment_id): Observable<any> {
    return this.http.delete(`${environment.apiURL}/appointment/${appointment_id}`)
   } 

   public getAppointmentOfBillingCustomer(customer_name): Observable<any> {
    return this.http.get(`${environment.apiURL}/appointment/${customer_name}/${this.branchId}`)
   }
}
