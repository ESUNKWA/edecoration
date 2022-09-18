import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Cart } from './cart.model';

import { cartData } from './data';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})

/**
 * Ecommerce Cart component
 */
export class CartComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  value: number;

  cartData: any[] = [];
  panier: any[] = [];
  totalAchat: any = {};

  constructor( private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    this.value = 4;
    this.breadCrumbItems = [{ label: 'Vente' }, { label: 'Panier du client', active: true }];
    this.panier = JSON.parse(this.activatedRoute.snapshot.queryParamMap.get('panier'));
    console.log(this.panier);

    this._fetchData();
  }

  /**
   * Cart data fetch
   */
  private _fetchData() {
    //this.cartData = cartData;
    this.cartData = this.panier;
  }

  setStock(val, index){

  this.cartData[index].r_quantite = parseInt(val.value,10);
  this.cartData[index].r_sous_total = this.cartData[index].r_quantite * this.cartData[index].r_prix_vente;

  //Calcul du total
  this.totalAchat = this.cartData.reduce((a, b) => ({value: a.r_sous_total + b.r_sous_total}));;

  }

  navigateCart(){
    this.router.navigate(
                        ['/edeco/shop/checkout'],
                        { queryParams: { panierAchat: JSON.stringify(this.cartData), totalAchat: JSON.stringify(this.totalAchat.value)},
                          skipLocationChange: true });
  }

  navigateProduct(){
    this.router.navigate(
                        ['/edeco/shop/products'],
                        { queryParams: { panier: JSON.stringify(this.panier)},
                          skipLocationChange: true });
  }
}
