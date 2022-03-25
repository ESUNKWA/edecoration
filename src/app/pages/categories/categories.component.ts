import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { AdvancedSortableDirective, SortEvent } from '../tables/advancedtable/advanced-sortable.directive';
import { Table } from '../tables/advancedtable/advanced.model';
import { AdvancedService } from '../../core/services/advanced.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriesService } from 'src/app/core/services/categories/categories.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifService } from 'src/app/core/services/notif.service';
import { UserService } from 'src/app/core/services/usersinfos/user.service';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class CategoriesComponent implements OnInit {

// bread crum data
breadCrumbItems: Array<{}>;
tables$: Observable<Table[]>;
total$: Observable<number>;
@ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;

datas: Observable<Table[]>;
modalTitle: any = '';
modeAppel: any = 'création';
  categoriesTab: any = [];
  categoriesData: FormGroup;
  ligneCategorie: any = {};

  viewTable: boolean = false;
  searChIn: any;
  userData: any;


  constructor(public service: AdvancedService, private modalService: NgbModal, private categories: CategoriesService,
              public fb: FormBuilder, private notifications: NotifService, private user: UserService) { }



  ngOnInit(): void {
    this.userData = this.user._donnesUtilisateur()[0];
    
    this.breadCrumbItems = [{ label: 'Eden décoration' }, { label: 'Catégories de produits', active: true }];

    this.categoriesData = this.fb.group({
      r_libelle: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      p_description: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]]
    });
    this._listCategories();
  }

  _listCategories(): void {
    this.categories._getCategories().subscribe(
      (data: any) => {
        this.categoriesTab = [...data._result];
        setTimeout(() => {
          this.viewTable = true;
        }, 500);
      },
      (err) => {console.log(err.stack);
      }
    );
  }

  fctSaisieCat(largeDataModal: any){
    this.modeAppel = 'creation';
    this.modalTitle = 'Saisie d\'une nouelle catégorie de produit';

    this.largeModal(largeDataModal);
  }

  fctModiCat(largeDataModal: any, categorie){
    this.ligneCategorie = {...categorie};

    this.modeAppel = 'modif';
    this.modalTitle = `Modification catégorie de produit [ ${this.ligneCategorie.r_libelle} ]`;


    this.largeModal(largeDataModal);
  }

  _register(): void {

    this.categoriesData.value.p_utilisateur = parseInt(this.userData.r_i, 10);

    switch (this.modeAppel) {
      case 'creation':
          this.categories._create(this.categoriesData.value).subscribe(
            (dataServer: any) => {
              switch(dataServer._status){
                case -100:
                  for (const key in dataServer._result) {
                    this.notifications.sendMessage(dataServer._result[key],'warning');
                    break;
                  }
                  break;

                case 0:
                  this.notifications.sendMessage(`${dataServer._result}`,'error');
                  break;

                case 1:
                  this.notifications.sendMessage(`${dataServer._result}`,'success');
                  break;
              }
              this.categoriesData.reset();

              this._listCategories();
            },
            (err: any) => {
              console.log(err);
            }
          );
        break;

      case 'modif':
        this.categories._update(this.categoriesData.value, this.ligneCategorie.r_i).subscribe(
          (dataServer: any) => {
            this.categoriesData.reset();
            this.notifications.sendMessage(`${dataServer._result}`,'success');
            this._listCategories();
          },
          (err: any) => {
            console.log(err);
          }
        );
      default:
        break;
    }
  }

  //Appel de la modal
  largeModal(exlargeModal: any) {
    this.modalService.open(exlargeModal, { size: 'lg', centered: true });
  }

  //Filtre datatable
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

}
