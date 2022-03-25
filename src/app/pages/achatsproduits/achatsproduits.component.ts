import { Component, OnInit } from '@angular/core';
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

  constructor( private achatService: AchatproduitsService ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Eden décoration' }, { label: 'Achat des produits', active: true }];
    this._listCTarifications();
  }

  _listCTarifications(): void {
    this.achatService._getAchatsProduits().subscribe(
      (data: any) => {
        this.achatProduiTab = [...data._result];
        setTimeout(() => {
          this.viewTable = true;
        }, 500);
      },
      (err) => {console.log(err.stack);
      }
    );
  }

}
