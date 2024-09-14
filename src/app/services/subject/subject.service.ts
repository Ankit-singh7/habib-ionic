import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { RouterPage } from 'src/app/dashboard/router.page';
import { Router, ActivatedRoute } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class SubjectService extends RouterPage {


  public fullName =  new BehaviorSubject(null);
  public authToken = new BehaviorSubject(null);
  public userType = new BehaviorSubject(null);
  public isLoggedIn = new BehaviorSubject(null);
  public userId = new BehaviorSubject(null);
  public sessionId = new BehaviorSubject(null);
  public sessionBalance = new BehaviorSubject(null);
  public canWithdraw = new BehaviorSubject(null);
  public branchId =  new BehaviorSubject(null);
  public branchName =  new BehaviorSubject(null);
  public role =  new BehaviorSubject(null);
  public subjects = {};


  constructor( private platform: Platform,
    private storage: Storage,
    private router: Router, 
    private route: ActivatedRoute) {
super(router,route)
}

  onEnter(){
    this.initializeApp();
  }

  initializeApp(){
    this.platform.ready().then(() => {

    this.fullName.next(localStorage.getItem('fullName'))

    this.authToken.next(localStorage.getItem('token'))

    this.userType.next(localStorage.getItem('userType'));

    this.isLoggedIn.next(localStorage.getItem('isLoggedIn'));

    this.userId.next(localStorage.getItem('userId'));

    this.sessionId.next(localStorage.getItem('sessionId'))

    this.sessionBalance.next(localStorage.getItem('sessionBalance'))


    this.canWithdraw.next(localStorage.getItem('canWithdraw'))

    this.branchId.next(localStorage.getItem('branchId'))

    this.branchName.next(localStorage.getItem('branchName'))

    this.role.next(localStorage.getItem('role'))

    })
  }




  setBranchId(val) {

    localStorage.setItem('branchId', val)
    this.branchId.next(val);
  }

  getBranchId() {
    return this.branchId.asObservable();
  }

  setBranchName(val) {

    localStorage.setItem('branchName', val)
    this.branchName.next(val);
  }

  getBranchName() {
    return this.branchName.asObservable();
  }


  setRole(val) {
    localStorage.setItem('role', val)
    this.role.next(val);
  }

  getRole() {
    return this.role.asObservable();
  }






  setUserType(val) {
    localStorage.setItem('userType', val)
    this.userType.next(val);
  }

  getUserType() {
    return this.userType.asObservable();
  }


  setToken(val) {
    localStorage.setItem('token', val);
    localStorage.setItem('token', val)
    this.authToken.next(val);
  }
  
  getToken(){
    return this.authToken.asObservable();
  }

  setFullName(val){
    localStorage.setItem('fullName', val)
    this.fullName.next(val);
  }

  getFullName() {
    return this.fullName.asObservable();
  }
  

  getLoginStatus(){
    return this.isLoggedIn.asObservable()
  }

  setLoginStatus(val){
    localStorage.setItem('isLoggedIn', val);
    localStorage.setItem('isLoggedIn', val)
    this.isLoggedIn.next(val)
  }


  getUserId(){
    return this.userId.asObservable()
  }

  setUserId(val){
    localStorage.setItem('userId', val)
    this.userId.next(val)
  }


  getSessionId(){
    return this.sessionId.asObservable()
  }

  setSessionId(val){
    localStorage.setItem('sessionId',val)
    this.sessionId.next(val)
  }

  getSessionBalance(){
    return this.sessionBalance.asObservable()
  }

  setSessionBalance(val){
    localStorage.setItem('sessionBalance',val)
    this.sessionBalance.next(val)
  }

  getCanWithdraw(){
    return this.canWithdraw.asObservable()
  }

  setCanWithdraw(val){
    localStorage.setItem('canWithdraw', val)
    this.canWithdraw.next(val)
  }

  setLocalStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  getLocalStorage(key) {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  }
  

  resetAllSubjects(){
    this.fullName.next(null);
    this.authToken.next(null);
    this.userType.next(null);
    this.isLoggedIn.next(null);
    this.userId.next(null);
    this.sessionId.next(null);
    this.sessionBalance.next(null);
    this.canWithdraw.next(null);
    this.branchId.next(null);
    this.branchName.next(null);
    this.role.next(null);
  }

}

