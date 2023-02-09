import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment'
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public login(data): Observable<any> {
    return this.http.post(`${environment.apiURL}/user/login`, data);
  }

  public changePassword(data):Observable<any> {
    return this.http.post(`${environment.apiURL}/user/resetPassword`,data)
  }

  public getAllEmployee(paramStr?:any):Observable<any> {
    let str = paramStr?paramStr:''
    return this.http.get(`${environment.apiURL}/user/e?${str}`)
  }
  getBranchList():Observable<any>{
    return this.http.get(`${environment.apiURL}/branch`);
  }


}
