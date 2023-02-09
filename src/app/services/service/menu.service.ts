import { HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }


  getAllServiceCatergory = ():Observable<any> => {
     return this.http.get(`${environment.apiURL}/service-type`)
  }

  getActiveService = ():Observable<any> => {
    return this.http.get(`${environment.apiURL}/service/active`)
  }

  getServiceByCategory = (id): Observable<any> => {
    return this.http.get(`${environment.apiURL}/service/${id}/by_cat`)
  }

  getAllBrand = (): Observable<any> => {
    return this.http.get(`${environment.apiURL}/brand`)
  }
  
  getActiveProduct = (): Observable<any> => {
    return this.http.get(`${environment.apiURL}/product/active`)
  }

  getProductByBrand = (id): Observable<any> => {
    return this.http.get(`${environment.apiURL}/product/${id}/by_brand`)
  }


}
