import { Component, OnInit } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { InvoiceService } from '../services/invoice/invoice.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { SubjectService } from '../services/subject/subject.service';
import { MenuService } from '../services/service/menu.service';

@Component({
  selector: 'app-product-usage-detail',
  templateUrl: './product-usage-detail.page.html',
  styleUrls: ['./product-usage-detail.page.scss'],
})
export class ProductUsageDetailPage implements OnInit {

  public billId:any;
  public billDetail: any;
  public date: any;
  public role = localStorage.getItem('role');
  public productList = [];
  constructor(
    private invoiceService: InvoiceService,
    private loading: LoadingController,
    private router: Router,
    private subjectService: SubjectService,
    private menuService: MenuService,
    private route: ActivatedRoute) { 
      this.route.queryParams.subscribe(params => {
           this.billId = params['id'];
           this.getBillDetail(this.billId)
      })
      this.subjectService.getRole().subscribe((res) => {
          this.role = res
      })
       this.getProductList();
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
        if(this.billDetail.services.length > 0) {
          this.billDetail.services = this.billDetail.services.map((item) => ({
            ...item,
            product_usage_detail : [
              {
                name: '',
                quantity: '',
                product_id: ''
              }
            ]

          }))
        }
        this.date = moment(res.data.createdOn).format('DD/MM/yy');
      }
      loader.dismiss()
      }, err => loader.dismiss())
    })
  }

  getProductList() {
    this.menuService.getAllProduct().subscribe((res) => {
      this.productList = res.data;
    })
  }

  addMoreProduct(item: any) {
    item.product_usage_detail.push({
      name: '',
      quantity: '',
      product_id: ''
    });
  }

  async updateBill() {
    const updates = this.billDetail.services.map(async (service) => {
      service.product_usage_detail = service.product_usage_detail
        .map((item) => {
          const isNameObject = typeof item.name === "object" && item.name !== null;
          const name = isNameObject ? item.name.name : item.name;
          const product_id = isNameObject ? item.name.product_id : item.product_id;
  
          return {
            name: name || "",
            product_id: product_id || "",
            quantity: item.quantity || "",
          };
        })
        .filter(
          (item) =>
            item.name.trim() !== "" ||
            item.product_id.trim() !== "" ||
            item.quantity !== ""
        );
    });
  
    await Promise.all(updates);
  
    let loader = await this.loading.create({
      message: 'Updating Product Usage...'
    });

    loader.present().then(() => {
      this.invoiceService.updateBill(this.billDetail, this.billId).subscribe((res) => {
          this.router.navigate(['/con/billing-list']);
          loader.dismiss();
      })
    })
  }

  removeProduct(item: any, index: number) {
    if (item.product_usage_detail && index > -1) {
      item.product_usage_detail.splice(index, 1);
    }
  }
  
}
