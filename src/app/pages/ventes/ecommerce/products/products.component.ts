import { Component, OnInit } from '@angular/core';
import { produitModel, productList } from '../produit.model';
import { Options } from 'ng5-slider';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

/**
 * Ecommerce products component
 */

export class ProductsComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  pricevalue = 100;
  minVal = 100;
  maxVal = 500;

  priceoption: Options = {
    floor: 0,
    ceil: 800,
    translate: (value: number): string => {
      return 'fcfa' + value;
    },
  };
  log = '';
  discountRates: number[] = [];
  public products: produitModel[] = [];
  public productTemp: produitModel[] = [];

  public panier: any[] = [];

  constructor(private http: HttpClient, private router: Router,) { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Products', active: true }];
    this.products = Object.assign([], productList);

    // this.http.get<any>(`http://localhost:8000/api/products`)
    //   .subscribe((response) => {
    //     this.products = response.data;
    //   });

  }

  searchFilter(e) {
    const searchStr = e.target.value;
    this.products = productList.filter((product) => {
      return product.r_nom_produit.toLowerCase().search(searchStr.toLowerCase()) !== -1;
    });
  }

  discountLessFilter(e, percentage) {
    if (e.target.checked && this.discountRates.length === 0) {
      this.products = productList.filter((product) => {
        return product.r_prix_vente < percentage;
      });
    }
    else {
      this.products = productList.filter((product) => {
        return product.r_prix_vente >= Math.max.apply(null, this);
      }, this.discountRates);
    }
  }

  discountMoreFilter(e, percentage: number) {
    if (e.target.checked) {
      this.discountRates.push(percentage);
    } else {
      this.discountRates.splice(this.discountRates.indexOf(percentage), 1);
    }
    this.products = productList.filter((product) => {
      return product.r_prix_vente >= Math.max.apply(null, this);
    }, this.discountRates);
  }

  valueChange(value: number, boundary: boolean): void {
    if (boundary) {
      this.minVal = value;
    } else {
      this.maxVal = value;
      this.products = productList.filter(function (product) {
        return product.r_prix_vente <= value && product.r_prix_vente >= this;
      }, this.minVal);
    }
  }

  getDetailsProduct(product){
    this.panier.push(product);
  }

  navigateCart(){
    this.router.navigate(
                        ['/edeco/shop/cart'],
                        { queryParams: { panier: JSON.stringify(this.panier) },
                          skipLocationChange: true });



  }

}
