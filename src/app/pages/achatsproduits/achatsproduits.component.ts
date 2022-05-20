import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AchatproduitsService } from 'src/app/core/services/achats/achatproduits.service';

@Component({
  selector: 'app-achatsproduits',
  templateUrl: './achatsproduits.component.html',
  styleUrls: ['./achatsproduits.component.scss']
})
export class AchatsproduitsComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  achatProduiTab: any = [];
  viewTable: boolean = false;
  term: any;

  //Paginations
  premiumData: any[] = [];
  paginateData: any[] = [];
  source$: Observable<any>;
  page = 1;
  pageSize = 5; //Nbre de ligne à afficher
  collectionSize = 0;

  getPremiumData() {
    this.paginateData = this.achatProduiTab.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
    
  }


  constructor( private achatService: AchatproduitsService ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Eden décoration' }, { label: 'Achat des produits', active: true }];
    this._listCTarifications();
  }

  _listCTarifications(): void {
    this.achatService._getAchatsProduits().subscribe(
      (data: any) => {
        this.achatProduiTab = [...data._result];
        this.collectionSize = this.achatProduiTab.length;
        this.getPremiumData();
        setTimeout(() => {
          this.viewTable = true;
        }, 500);
      },
      (err) => {console.log(err.stack);
      }
    );
  }

}
