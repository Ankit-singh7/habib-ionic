import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-employee-sales-details',
  templateUrl: './employee-sales-details.page.html',
  styleUrls: ['./employee-sales-details.page.scss'],
})
export class EmployeeSalesDetailsPage {

  public employeeSales: any;
  constructor(private route: ActivatedRoute) { 
      this.route.params.subscribe(params => {
        this.employeeSales = JSON.parse(params['data']);
        this.employeeSales.p_price = this.employeeSales.p_price.toString()
        this.employeeSales['service_amounts'] = this.employeeSales?.s_price ? this.employeeSales?.s_price?.includes('+') ? this.employeeSales.s_price.split('+') : [this.employeeSales?.s_price]: [];
        this.employeeSales['service_names'] = this.employeeSales?.s_name ? this.employeeSales?.s_name?.includes(',') ? this.employeeSales.s_name.split(','): [this.employeeSales.s_name] : [];
        this.employeeSales['product_amounts'] = this.employeeSales?.p_price ? this.employeeSales?.p_price?.includes('+') ? this.employeeSales.p_price.split('+'): [this.employeeSales.p_price]: [];
        this.employeeSales['product_names'] = this.employeeSales?.p_name ? this.employeeSales?.p_name?.includes(',') ? this.employeeSales.p_name.split(','): [this.employeeSales.p_name] : [];
        this.employeeSales['services'] = this.employeeSales?.service_names ? this.employeeSales.service_names.map((item, index) =>  ({name: item, amount: this.employeeSales.service_amounts[index] })): [];
        this.employeeSales['products'] = this.employeeSales?.product_names ? this.employeeSales.product_names.map((item, index) =>  ({name: item, amount: this.employeeSales.product_amounts[index] })): []
      });
    }
}
