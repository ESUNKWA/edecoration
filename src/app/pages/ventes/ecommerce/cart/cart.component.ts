import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

  cartData: Cart[];
  panier: any[] = [];

  constructor( private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.value = 4;
    this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Cart', active: true }];
    this.panier = JSON.parse(this.activatedRoute.snapshot.queryParamMap.get('panier'));
    /**
     * fetches the data
     */
    this._fetchData();
  }

  /**
   * Cart data fetch
   */
  private _fetchData() {
    //this.cartData = cartData;
    this.cartData = this.panier;
  }
}
