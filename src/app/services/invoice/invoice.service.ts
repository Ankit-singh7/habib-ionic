import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment'
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { SubjectService } from '../subject/subject.service';


@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  public date = new Date();
  public formattedDate = moment(this.date).format('YYYY-MM-DD');
  public branchId;

  constructor(private http: HttpClient, private subjectService: SubjectService) { 
    this.subjectService.getBranchId().subscribe((res) => {
      this.branchId = res
    })

  }


  public getFoodCategory():Observable<any> {
    return this.http.get(`${environment.apiURL}/category/view/all?per_page=500&current_page=1`);
  }


  public getFoodSubCategory():Observable<any> {
    return this.http.get(`${environment.apiURL}/subcategory/all?per_page=500&current_page=1`);
  }

  public getUsedFood():Observable<any> {
    return this.http.get(`${environment.apiURL}/subcategory/used`)
  }

  public getsubCategoryByCategoryId(id):Observable<any> {
    return this.http.get(`${environment.apiURL}/category/${id}/getSubCatList`);
  }

  public createBill(data): Observable<any> {
    return this.http.post(`${environment.apiURL}/bill`,data)
  }

  public getAllBill(paramStr?:any): Observable<any> {
    let str = paramStr?paramStr:''
    return this.http.get(`${environment.apiURL}/bill/view/all?per_page=500&current_page=1&createdOn=${this.formattedDate}&${str}`)
  }

  public getAllBillAdmin(paramStr?:any): Observable<any> {
    let str = paramStr?paramStr:''
    return this.http.get(`${environment.apiURL}/bill/view/all?per_page=50000&current_page=1&${str}`)
  }

  public changeBillStatus(data,id): Observable<any> {
    return this.http.post(`${environment.apiURL}/bill/${id}/status`,data)
  }


  public updateBill(data,id): Observable<any> {
    return this.http.post(`${environment.apiURL}/bill/${id}/update`,data)
  }

  public deleteBill(id): Observable<any> {
    return this.http.delete(`${environment.apiURL}/bill/${id}`)
  }


  public getBillDetail(id):Observable<any>{
    return this.http.get(`${environment.apiURL}/bill/${id}/getById`)
  }

  public getTotal(paramStr?:any): Observable<any> {
    // let str = paramStr?paramStr:''
    return this.http.get(`${environment.apiURL}/bill/total?createdOn=${this.formattedDate}&branch_id=${this.branchId}`)
  }

  getCurrentSession(paramStr?:any):Observable<any> {
     let str = paramStr?paramStr:''
    return this.http.get(`${environment.apiURL}/session/findCurrentStatus?${str}`)
  }

  getTodaySession(paramStr): Observable<any> {
    let str = paramStr?paramStr:''
    return this.http.get(`${environment.apiURL}/session/view/all?${str}`)
  }

  deactivateAllSession(branchId): Observable<any> {
    return this.http.get(`${environment.apiURL}/session/${branchId}/deactivate`)
  }

  enterSessionAmount(data):Observable<any> {
    return this.http.post(`${environment.apiURL}/session/create`,data)
  }

  updateSession(data,id): Observable<any>{
    return this.http.put(`${environment.apiURL}/session/${id}/update`,data)
  }

  uploadPdf(data): Observable<any>{
    return this.http.post(`${environment.apiURL}/bill/upload`,data)
  }

  getBranchDetail(id): Observable<any> {
    return this.http.get(`${environment.apiURL}/branch/${id}`)
  }


  getAllServiceSalesReport = (paramObj?:any):Observable<any> => {
    return this.http.get(`${environment.apiURL}/service-sales-report/view/all?${paramObj}`)
  }


  getAllProductSalesReport = (paramObj?:any):Observable<any> => {
    return this.http.get(`${environment.apiURL}/product-sales-report/view/all?${paramObj}`)
  }


}
