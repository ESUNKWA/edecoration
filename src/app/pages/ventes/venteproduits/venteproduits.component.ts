import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ArticlesService } from 'src/app/core/services/articles/articles.service';
import { CryptDataService } from 'src/app/core/services/cryptojs/crypt-data.service';
import { NotifService } from 'src/app/core/services/notif.service';
import { UserService } from 'src/app/core/services/usersinfos/user.service';
import { VenteproduitsService } from 'src/app/core/services/venteproduits/venteproduits.service';

@Component({
  selector: 'app-venteproduits',
  templateUrl: './venteproduits.component.html',
  styleUrls: ['./venteproduits.component.scss']
})
export class VenteproduitsComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  ventesTab: any = [];
  viewTable: boolean = false;
  term: any;
  userData: any;
   //Paginations
   premiumData: any[] = [];
   paginateData: any[] = [];
   source$: Observable<any>;
   page = 1;
   pageSize = 5; //Nbre de ligne à afficher
   collectionSize = 0;

   getPremiumData() {
     this.paginateData = this.ventesTab.slice(
       (this.page - 1) * this.pageSize,
       (this.page - 1) * this.pageSize + this.pageSize
     );
   }

  constructor( private modalService: NgbModal, private venteServices: VenteproduitsService,
    public fb: FormBuilder, private notifications: NotifService, private user: UserService,
    private cryptDataService: CryptDataService) { }

  ngOnInit(): void {
    this.userData = this.user._donnesUtilisateur()[0];
    this.breadCrumbItems = [{ label: 'Eden décoration' }, { label: 'Liste des ventes', active: true }];

    this._listVentes();
  }

  _listVentes(): void {

    try {
      this.venteServices._listventes('2022-09-01','2022-09-30').subscribe(
        (data: any) => {

          let fournisseurs = this.cryptDataService.decrypt(data);
          this.ventesTab = [...fournisseurs.original._result];

          this.collectionSize = this.ventesTab.length;
          this.getPremiumData();
          setTimeout(() => {
            this.viewTable = true;
          }, 500);
        },
        (err) => {console.log(err);
        }
      );
    } catch (error) {
      console.log(error)
    }


    }

}
