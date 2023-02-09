import { Component, OnInit } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { InvoiceService } from '../services/invoice/invoice.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { SubjectService } from '../services/subject/subject.service';

@Component({
  selector: 'app-billing-view',
  templateUrl: './billing-view.page.html',
  styleUrls: ['./billing-view.page.scss'],
})
export class BillingViewPage implements OnInit {

  public billId:any;
  public billDetail: any;
  public date: any;
  public role = localStorage.getItem('role')
  constructor(private platform: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private invoiceService: InvoiceService,
    private loading: LoadingController,
    private router: Router,
    private subjectService: SubjectService,
    private route: ActivatedRoute) { 
      this.route.queryParams.subscribe(params => {
           this.billId = params['id'];
           this.getBillDetail(this.billId)
      })
      this.subjectService.getRole().subscribe((res) => {
          this.role = res
      })

    }

  ngOnInit() {
  }


  async getBillDetail(id){
    let loader = await this.loading.create({
      message: 'Please wait...',
    });

    loader.present().then(() => {
      
      this.invoiceService.getBillDetail(id).subscribe((res) => {
      if(res.data) {
        this.billDetail = res.data
        this.date = moment(res.data.createdOn).format('DD/MM/yy');
      }
      loader.dismiss()
      }, err => loader.dismiss())
    })
  }

}
