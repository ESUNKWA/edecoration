import { Component, OnInit } from '@angular/core';
import { produitModel, productList } from '../produit.model';
import { Options } from 'ng5-slider';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ArticlesService } from 'src/app/core/services/articles/articles.service';
import { CryptDataService } from 'src/app/core/services/cryptojs/crypt-data.service';
import { NotifService } from 'src/app/core/services/notif.service';

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
  produitsTab: any[] = [];

  constructor(private http: HttpClient, private router: Router, private artcilesServices: ArticlesService,
    private cryptDataService: CryptDataService, private notifications: NotifService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Products', active: true }];
    this.products = Object.assign([], productList);

    // this.http.get<any>(`http://localhost:8000/api/products`)
    //   .subscribe((response) => {
    //     this.products = response.data;
    //   });

    this._listProduits();
    this.panier = JSON.parse(this.activatedRoute.snapshot.queryParamMap.get('panier')) || [];
    console.log(this.panier);

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

  ajoutProduitPanier(product){
    product.r_quantite = 1;
    product.r_sous_total = 1 * product.r_prix_vente;
    if( this.panier.includes(product) ){
      this.notifications.sendMessage('Produit dejà ajouté au panier','warning');
      return;
    }
    this.panier.push(product);
  }

  navigateCart(){

    if( this.panier.length == 0 ){
      this.notifications.sendMessage('Veuillez ajouter des produit au panier','warning');
    }else{

      this.router.navigate(
        ['/edeco/shop/cart'],
        { queryParams: { panier: JSON.stringify(this.panier) },
          skipLocationChange: true });
    }


  }

  /**********************************************************************/

  _listProduits(): void {
    this.artcilesServices._list().subscribe(
      (data: any) => {
        let dataReponseDecrypt = this.cryptDataService.decrypt(data);
        let result = dataReponseDecrypt.original;
        this.produitsTab = result._result;
      },
      (err) => {console.log(err.stack);
      }
    );
  }

}
