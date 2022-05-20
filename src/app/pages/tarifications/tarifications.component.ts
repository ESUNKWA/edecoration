import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { TarificationsService } from 'src/app/core/services/tarifications/tarifications.service';
import { UserService } from 'src/app/core/services/usersinfos/user.service';
import { AdvancedSortableDirective } from '../tables/advancedtable/advanced-sortable.directive';

@Component({
  selector: 'app-tarifications',
  templateUrl: './tarifications.component.html',
  styleUrls: ['./tarifications.component.scss']
})
export class TarificationsComponent implements OnInit {
  tarificationTab: any = [];
  ligneTarification: any = {};
  breadCrumbItems: Array<{}>;
  modalTitle: any = '';
  viewTable: boolean = false;
  @ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;
  userData: any;
  
  term: any; // Filtre

  //Paginations
  premiumData: any[] = [];
  paginateData: any[] = [];
  source$: Observable<any>;
  page = 1;
  pageSize = 5; //Nbre de ligne à afficher
  collectionSize = 0;

  getPremiumData() {
    this.paginateData = this.tarificationTab.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
    
  }

  constructor( private tarifService: TarificationsService, private modalService: NgbModal,private user: UserService ) { }



  ngOnInit(): void {
    this.userData = this.user._donnesUtilisateur()[0];

    this.breadCrumbItems = [{ label: 'Eden décoration' }, { label: 'Tarification', active: true }];
    this._listCTarifications();
  }



  _listCTarifications(): void {
    this.tarifService._getTarifications().subscribe(
      (data: any) => {
        this.tarificationTab = [...data._result];
        this.collectionSize = this.tarificationTab.length;
        this.getPremiumData();
        setTimeout(() => {
          this.viewTable = true;
        }, 500);
      },
      (err) => {console.log(err.stack);
      }
    );
  }

  fctModiCat(largeDataModal: any, categorie){
    this.ligneTarification = {...categorie};

    this.ligneTarification = 'modif';
    this.ligneTarification = `Modification catégorie de produit [ ${this.ligneTarification.r_libelle} ]`;


    this.largeModal(largeDataModal);
  }

  _actionProduits(largeDataModal){

  }

  //Appel de la modal
  largeModal(exlargeModal: any) {
    this.modalService.open(exlargeModal, { size: 'lg', centered: true });
  }

}
