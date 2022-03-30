import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifService } from 'src/app/core/services/notif.service';
import { TarificationsService } from 'src/app/core/services/tarifications/tarifications.service';
import { UserService } from 'src/app/core/services/usersinfos/user.service';
import { AdvancedSortableDirective } from '../tables/advancedtable/advanced-sortable.directive';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
// bread crum data
breadCrumbItems: Array<{}>;
@ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;
userData: any;
modalTitle: any = '';
modeAppel: any = 'création';
tarificationTab: any = [];
viewTable: boolean = false;
  recapTab: any;

  constructor(private notifications: NotifService, private user: UserService, private modalService: NgbModal, private tarifService: TarificationsService,) { }

  ngOnInit(): void {
    this.userData = this.user._donnesUtilisateur()[0];

    this.breadCrumbItems = [{ label: 'Eden décoration' }, { label: 'Liste des location', active: true }];

    this._listProduits();

  }

  _valueQte(val,i){
    this.tarificationTab[i].qte = parseInt(val, 10);
    this.tarificationTab[i].total =  this.tarificationTab[i].qte*this.tarificationTab[i].r_prix_location;

    this.recapTab = this.tarificationTab.filter( el => el.qte >= 1);

    const a = this.recapTab.reduce((accumulator, curValue) => accumulator.total + curValue.total, 0)
    console.log(a)
  }

  _changeValcheck(val,i){
    this.tarificationTab[i].check = val;
    if(val == false){
      this.tarificationTab[i].qte = 0;
      this.tarificationTab[i].total =  this.tarificationTab[i].qte*this.tarificationTab[i].r_prix_location;
    }
    this.recapTab = this.tarificationTab.filter( el => el.qte >= 1);

  }

  _listProduits(): void {
    this.tarifService._getTarifications().subscribe(
      (data: any) => {
        this.tarificationTab = [...data._result];
        setTimeout(() => {
          this.viewTable = true;
        }, 500);
      },
      (err) => {console.log(err.stack);
      }
    );
  }

  _saisie_location(largeDataModal){
    this.largeModal(largeDataModal);
  }

  //Appel de la modal
  largeModal(exlargeModal: any) {
    this.modalService.open(exlargeModal, { size: 'xl', centered: true });

  }

}
