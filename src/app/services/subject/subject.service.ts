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

    //  this.storage.get('fullName').then((res) => {
    //    this.fullName.next(res)
    //  })


     this.authToken.next(localStorage.getItem('token'))
    //  this.storage.get('token').then((res) => {
    //    this.authToken.next(res)
    //  })

    this.userType.next(localStorage.getItem('userType'));
    //  this.storage.get('userType').then((res) => {
    //    this.userType.next(res);
    //  })

    this.isLoggedIn.next(localStorage.getItem('isLoggedIn'));
    //  this.storage.get('isLoggedIn').then((res) => {
    //    this.isLoggedIn.next(res);
    //  })

    this.userId.next(localStorage.getItem('userId'));
    //  this.storage.get('userId').then((res) => {
    //    this.userId.next(res);
    //  })

    this.sessionId.next(localStorage.getItem('sessionId'))
    //  this.storage.get('sessionId').then((res) => {
    //    this.sessionId.next(res)
    //  })

    this.sessionBalance.next(localStorage.getItem('sessionBalance'))
    //  this.storage.get('sessionBalance').then((res) => {
    //    this.sessionBalance.next(res)
    //  })


    this.canWithdraw.next(localStorage.getItem('canWithdraw'))
    //  this.storage.get('canWithdraw').then((res) => {
    //   this.canWithdraw.next(res)
    // })



    this.branchId.next(localStorage.getItem('branchId'))
    // this.storage.get('branchId').then((res) => {
    //   this.branchId.next(res)
    // })

    this.branchName.next(localStorage.getItem('branchName'))
    // this.storage.get('branchName').then((res) => {
    //   this.branchName.next(res)
    // })

    this.role.next(localStorage.getItem('role'))
    // this.storage.get('role').then((res) => {
    //   this.role.next(res)
    // })

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
    // localStorage.setItem('userType', val);
    localStorage.setItem('role', val)
    this.role.next(val);
  }

  getRole() {
    return this.role.asObservable();
  }






  setUserType(val) {
    // localStorage.setItem('userType', val);
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
    // localStorage.setItem('fullName', val);
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
    // localStorage.setItem('userId', val);
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

}

