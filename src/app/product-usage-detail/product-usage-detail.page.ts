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
  emptyMessage: string;
  brandList: any;
  selectedBrandId: string | null = null;
  constructor(
    private invoiceService: InvoiceService,
    private loading: LoadingController,
    private router: Router,
    private subjectService: SubjectService,
    private menuService: MenuService,
    private route: ActivatedRoute) { 
      this.route.queryParams.subscribe(async params => {
           this.billId = params['id'];
           await this.getBrand();  
           this.getBillDetail(this.billId)
      })
      this.subjectService.getRole().subscribe((res) => {
          this.role = res
      })
       
    }

  ngOnInit() {}


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
            product_usage_detail:
            Array.isArray(item.product_usage_detail) && item.product_usage_detail.length > 0
              ? item.product_usage_detail.map((pud) => {
                return{
                ...pud,
                brand: this.brandList?.find(b => b.brand_id === pud.brand_id) || null,
                product: this.productList?.find(p => p.product_id === pud.product_id) || null
              }})
              : [
                  {
                    name: '',
                    quantity: '',
                    product_id: '',
                    unit: '',
                  },
                ],


          }))
        }
        this.date = moment(res.data.createdOn).format('DD/MM/yy');
      }
      loader.dismiss()
      }, err => loader.dismiss())
    })
  }

  getProductList() : Promise<void>  {
    return  new Promise((resolve) => {
      this.menuService.getAllProduct().subscribe((res) => {
        this.productList = res.data.map((item) => ({
          name: item.name,
          quantity: '',
          unit: item.uom,
          product_id: item.product_id
        }));
        resolve();
      })
    })
  }


  getBrand(): Promise<void> {
    return new Promise((resolve) => {
      this.menuService.getAllBrand().subscribe((res) => {
        this.brandList = res.data;
        resolve();
      });
    });
  }
  

  async getProductListbyBrand(id) {
    this.productList = [];
    let loader = await this.loading.create({
      message: 'Please wait...',
    });

    loader.present().then(() => {
      this.menuService.getProductByBrand(id).subscribe((res) => {
        if (res.data) {

          this.productList = res.data.map((item) => ({
            name: item.name,
            quantity: '',
            unit: item.uom,
            product_id: item.product_id
          }));
        } else {
          this.emptyMessage = 'No items found.'
        }

        loader.dismiss();

      }, err => loader.dismiss())
    })
  }

  onBrandSelect(event: any, usage: any) {
    const brand = event?.value;
  
    // Reset ONLY current usage product
    usage.name = '';
  
    // Load product list for selected brand
    if (brand?.brand_id) {
      this.getProductListbyBrand(brand.brand_id);
    } else {
      this.productList = [];
    }
  }
  
  

  addMoreProduct(item: any) {
    item.product_usage_detail.push({
      name: '',
      quantity: '',
      product_id: '',
      brand_id: '',
      unit: ''
    });
  }

  async updateBill() {
    const updates = this.billDetail.services.map(async (service) => {
      service.product_usage_detail = service.product_usage_detail
        .map((item) => {
          const isNameObject = typeof item.name === "object" && item.name !== null;
          const name = !isNameObject ? item.product.name : item.name;
          const product_id = !isNameObject ? item.product.product_id : item.product_id;
          const unit = !isNameObject ? item.product.unit : item.unit;
  
          return {
            name: name || "",
            product_id: product_id || "",
            brand_id: item.brand?.brand_id || item.brand_id || "",
            quantity: item.quantity || "",
            unit: unit || ""
          };
        })
        .filter(
          (item) =>
            item.name.trim() !== "" ||
            item.product_id.trim() !== "" ||
            item.quantity !== "" || 
            item.unit !== ""
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

  isString(value: any): boolean {
    return typeof value === 'string';
  }
  
}
