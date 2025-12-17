import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterPage } from '../dashboard/router.page';
import { Platform, LoadingController, AlertController } from '@ionic/angular';
import { InvoiceService } from '../services/invoice/invoice.service';
import { SubjectService } from '../services/subject/subject.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-employee-expense',
  templateUrl: './employee-expense.page.html',
  styleUrls: ['./employee-expense.page.scss'],
})
export class EmployeeExpensePage extends RouterPage{

  public sessionDetail:any;
  public showError = false;
  public userName: any;
  public isWithdrawn = 'false';
  public userId: any;
  public role: any;
  public branchId: any;
  public branchName: any;
  public executed = false;
  public createSession = false;
  total: any;
  expenseDescription: string = '';
  expenseAmount: number | null = null;
  buttonText: string = 'Save';
  expenseId: any;
  expenses: any;

  constructor(private platform: Platform,
    private invoiceService: InvoiceService,
    private loading: LoadingController,
    private alertController: AlertController,
    private subjectService: SubjectService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute) {
      super(router,route);    
  }


  onEnter(){
    this.cdr.detectChanges()
    this.subjectService.getFullName().subscribe((res) => {
      this.userName = res;
      this.subjectService.getUserId().subscribe((res) => {
        this.userId = res
        this.subjectService.getRole().subscribe((res) => {
          console.log(res)
          this.role  = res
          this.subjectService.getBranchId().subscribe((res) => {
            this.branchId = res
            this.subjectService.getBranchName().subscribe((res) => {
              this.branchName = res
              if(!this.executed) {
                
                if(this.userName !== null && this.userId !== null && this.role !== null && this.branchId !== null  && this.branchName !== null) {
                  this.cdr.detectChanges()
                  this.getCurrentStatus();
                  if(this.userId) {
                    const today = new Date();

                    // Truncate the time part (set hours, minutes, seconds, and ms to 0)
                    const truncatedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    this.getEmployeeExpenseDetail(this.userId, truncatedDate);
                  }
                  this.executed = true;
                }  
              }
              
            })
          })
        })
      })
    })

  }

  ionViewDidLeave(){
    this.executed = false;
  }


  async getCurrentStatus() {
                      
    if(this.role === 'operator') {
    let loader = await this.loading.create({
      message: 'Please wait...',
    });

    loader.present().then(() => {
      
      let data = {
           
        branch_id: this.branchId,
        date: moment(new Date()).format('DD-MM-YYYY'),
  
      }
     let filterStr = '';
        for (let item in data) {
           if(data[item]) {
             filterStr = `${filterStr}${item}=${data[item]}&`
           }
           }
      this.invoiceService.getCurrentSession(filterStr).subscribe((res) => {
          
        if(res.data === null) {
          this.presentPrompt()
          this.isWithdrawn = 'false'
        } else {
          this.subjectService.setSessionId(res.data.session_id);
          this.subjectService.setSessionBalance(Number(res.data.session_amount));
          this.sessionDetail = res.data
          this.isWithdrawn = res.data.isWithdrawn
        }
        loader.dismiss()
      },err => loader.dismiss())
    })
  }
}

  async presentPrompt() {
    let alert =await this.alertController.create({
      header: 'Start your Session',
      subHeader:'Enter an opening balance to start the day.',
      mode: 'ios',
      backdropDismiss: false,
      inputs: [
        {
          name: 'amount',
          placeholder: 'Opening Balance',
          type: 'number'
        },
        {
          name: 'expenseAmount',
          placeholder: 'Expense Opening Balance',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Submit',
          handler: async data => {

            if(data.amount && data.expenseAmount) {
                          
              let loader = await this.loading.create({
                message: 'Please wait...',
              });
          
              loader.present().then(() => {

            
                const obj = {
                 session_status:'true',
                 session_amount: Number(data.amount),
                 user_name: this.userName,
                 branch_id: this.branchId,
                 branch_name: this.branchName,
                 drawer_balance: Number(data.amount),
                 expense_drawer_balance: Number(data.expenseAmount)
                }
 
                this.invoiceService.enterSessionAmount(obj).subscribe((res) => {
                  this.getCurrentStatus();
                  this.subjectService.setSessionId(res.data.session_id);
                  this.subjectService.setSessionBalance(Number(res.data.session_amount));
                     loader.dismiss();
                },err => {
                  loader.dismiss();
 
                })
              })
            } else {
              this.presentPrompt();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async getEmployeeExpenseDetail(id, createdOn) {
    let loader = await this.loading.create({
      message: 'Please wait...',
    });
    loader.present();

    this.userService.getEmployeeExpensesDetail(id, createdOn).subscribe(
      (res) => {
        if (res.data?.expenses && res.data?.expenses.length > 0) {
          this.expenses = res.data.expenses;
          this.expenseId = res.data.expense_id;
          this.buttonText = 'Edit';
        } else {
          this.expenses = [{ expense_reason: '', expense_amount: '' , in_amount: '', drawer_balance: null, closing_balance: null}]; // Default single field
          this.buttonText = 'Save';
        }
        loader.dismiss();
      },
      (err) => loader.dismiss()
    );
  }

  addNewExpense() {
    this.expenses.push({ expense_reason: '', expense_amount: '' , in_amount: '', drawer_balance: null, closing_balance: null});
  }

  removeExpense(index: number) {
      this.expenses.splice(index, 1);
  }

  async saveEditExpense() {
    if (this.expenses.length === 0) return;
  
    const loader = await this.loading.create({
      message: 'Please wait...',
    });
    await loader.present();
  
    try {
      const hasInAmount = this.expenses.some(
        (e) => e.in_amount && Number(e.in_amount) > 0
      );
      const hasExpenseAmount = this.expenses.some(
        (e) => e.expense_amount && Number(e.expense_amount) > 0
      );
  
      // Get current drawer balance from session
      const openingBalance = this.sessionDetail?.expense_drawer_balance || 0;
  
      // Calculate total in_amount and expense_amount
      const totalInAmount = this.expenses.reduce(
        (sum, e) => sum + (Number(e.in_amount) || 0),
        0
      );
      const totalExpenseAmount = this.expenses.reduce(
        (sum, e) => sum + (Number(e.expense_amount) || 0),
        0
      );
  
      // Compute closing balance
      const closingBalance = openingBalance + totalInAmount - totalExpenseAmount;
  
      // ✅ Add balances to first object in expenses array
      if (this.expenses.length > 0) {
        this.expenses[0].drawer_balance = openingBalance;
        this.expenses[0].closing_balance = closingBalance;
      }
  
      // Prepare expense payload
      const expenseData = {
        employee_id: this.userId,
        expenses: this.expenses,
        employee_name: this.userName,
        branch_id: this.branchId,
        branch_name: this.branchName,
      };
  
      // ✅ Update session balance if necessary
      // if (hasInAmount || hasExpenseAmount) {
      //   const sessionUpdateData = {
      //     expense_drawer_balance: closingBalance,
      //   };
      //   await this.invoiceService
      //     .updateSession(sessionUpdateData, this.sessionDetail.session_id)
      //     .toPromise();
      // }
  
      // ✅ Save or update expenses
      if (this.buttonText === 'Save') {
        await this.userService.saveEmployeeExpensesDetail(expenseData).toPromise();
      } else {
        await this.userService
          .updateEmployeeExpensesDetail(expenseData, this.expenseId)
          .toPromise();
      }
  
      this.router.navigate(['/con/dashboard']);
    } catch (err) {
      console.error(err);
    } finally {
      loader.dismiss();
    }
  }
  


}
