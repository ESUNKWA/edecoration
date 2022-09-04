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
import { CryptDataService } from 'src/app/core/services/cryptojs/crypt-data.service';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class CategoriesComponent implements OnInit {

// bread crum data
breadCrumbItems: Array<{}>;
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
  term: any;

  //Paginations
  premiumData: any[] = [];
  paginateData: any[] = [];
  source$: Observable<any>;
  page = 1;
  pageSize = 5; //Nbre de ligne à afficher
  collectionSize = 0;

  getPremiumData() {
    this.paginateData = this.categoriesTab.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );

  }



  constructor(public service: AdvancedService, private modalService: NgbModal, private categories: CategoriesService,
              public fb: FormBuilder, private notifications: NotifService, private user: UserService, private cryptDataService: CryptDataService) { }


  ngOnInit(): void {
    this.userData = this.user._donnesUtilisateur()[0];

    this.breadCrumbItems = [{ label: 'Eden décoration' }, { label: 'Catégories de produits', active: true }];

    this.categoriesData = this.fb.group({
      r_libelle: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+'), Validators.minLength(4)]],
      p_description: ['']
    });
    this._listCategories();
  }

  get f () { return this.categoriesData.controls;}

  _listCategories(): void {


  try {
    this.categories._getCategories().subscribe(
      (data: any) => {

        let categoriesList = this.cryptDataService.decrypt(data);
        this.categoriesTab = [...categoriesList.original._result];

        this.collectionSize = this.categoriesTab.length;
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

  fctSaisieCat(largeDataModal: any){
    this.modeAppel = 'creation';
    this.modalTitle = 'Saisie d\'une nouelle catégorie de produit';
    this.categoriesData.reset();
    this.largeModal(largeDataModal);
  }

  fctModiCat(largeDataModal: any, categorie){
    this.ligneCategorie = {...categorie};

    this.modeAppel = 'modif';
    this.modalTitle = `Modification catégorie de produit [ ${this.ligneCategorie.r_libelle} ]`;


    this.largeModal(largeDataModal);
  }

  _resetForm() {
    this.categoriesData.reset()
  }

  // cryptData(data: any = {}){

  //   let password = '123456';
  //   return CryptoJS.AES.encrypt(JSON.stringify(data), password,{
  //     format: this.JsonFormatter
  //   }).toString();
  // }

  _register(): void {

    if (this.categoriesData.invalid) {
      return;
    }

    this.categoriesData.value.p_utilisateur = parseInt(this.userData.r_i, 10);

    let donnees = this.cryptDataService.crypt(this.categoriesData.value);


    switch (this.modeAppel) {
      case 'creation':
          this.categories._create({p_data: donnees}).subscribe(
            (dataServer: any) => {

              let messageAffiche = this.cryptDataService.decrypt(dataServer._result);


              switch(dataServer._status){
                case -100:
                  for (const key in messageAffiche._result) {
                    this.notifications.sendMessage(messageAffiche[key],'warning');
                    break;
                  }
                  break;

                case 0:
                  this.notifications.sendMessage(`${messageAffiche}`,'error');
                  break;

                case 1:
                  this.notifications.sendMessage(`${messageAffiche}`,'success');
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

}
