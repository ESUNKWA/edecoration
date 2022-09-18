import { ArticlesService } from './../../../core/services/articles/articles.service';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from '@fullcalendar/daygrid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { CryptDataService } from 'src/app/core/services/cryptojs/crypt-data.service';
import { NotifService } from 'src/app/core/services/notif.service';
import { UserService } from 'src/app/core/services/usersinfos/user.service';
import { AdvancedSortableDirective } from '../../tables/advancedtable/advanced-sortable.directive';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {

  // bread crum data
  breadCrumbItems: Array<{}>;
  @ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;

  datas: Observable<Table[]>;
  modalTitle: any = '';
  modeAppel: any = 'création';
    categoriesTab: any = [];
    categoriesData: FormGroup;
    ligneArticles: any = {};

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

  constructor(private modalService: NgbModal, private artcilesServices: ArticlesService,
    public fb: FormBuilder, private notifications: NotifService, private user: UserService,
    private cryptDataService: CryptDataService) { }


  ngOnInit(): void {
    this.userData = this.user._donnesUtilisateur()[0];

    this.breadCrumbItems = [{ label: 'Eden décoration' }, { label: 'Produits', active: true }];

    this.categoriesData = this.fb.group({
      r_nom_produit: ['', [Validators.required]],
      r_prix_vente: ['', [Validators.required]],
      r_stock: ['', [Validators.required]],
      r_description: ['']
    });
    this._listArticles();
  }

  get f () { return this.categoriesData.controls;}

  _listArticles(): void {


  try {
    this.artcilesServices._list().subscribe(
      (data: any) => {

        let fournisseurs = this.cryptDataService.decrypt(data);
        this.categoriesTab = [...fournisseurs.original._result];

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

  fctSaisieFourniss(largeDataModal: any){
    this.modeAppel = 'creation';
    this.modalTitle = 'Saisie un nouveau article';
    this.categoriesData.reset();
    this.largeModal(largeDataModal);
  }

  fctModiFourniss(largeDataModal: any, categorie){
    this.ligneArticles = {...categorie};

    this.modeAppel = 'modif';
    this.modalTitle = `Modification de l\'article [ ${this.ligneArticles.r_nom_produit} ]`;


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

    /* if (this.categoriesData.invalid) {
      return;
    } */




    switch (this.modeAppel) {
      case 'creation':
        this.categoriesData.value.r_creer_par = parseInt(this.userData.r_i, 10);
        let donnees = this.cryptDataService.crypt(this.categoriesData.value);
          this.artcilesServices._create({p_data:donnees}).subscribe(
            (dataServer: any) => {

              let messageAffiche = this.cryptDataService.decrypt(JSON.parse(dataServer._message));

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

              this._listArticles();
            },
            (err: any) => {
              console.log(err);
            }
          );
        break;

      case 'modif':
        this.categoriesData.value.r_modifier_par = parseInt(this.userData.r_i, 10);

        let donneesUp = this.cryptDataService.crypt(this.categoriesData.value);

        this.artcilesServices._update({p_data:donneesUp}, this.ligneArticles.id).subscribe(
          (dataServer: any) => {

            let dataReponseDecrypt = this.cryptDataService.decrypt(dataServer);

            let result = dataReponseDecrypt.original;

            switch(result._status){
              case -100:
                for (const key in result._result) {
                  this.notifications.sendMessage(result[key],'warning');
                  break;
                }
                break;

              case 0:
                this.notifications.sendMessage(`${result._message}`,'error');
                break;

              case 1:
                this.notifications.sendMessage(`${result._message}`,'success');
                break;
            }

            this.categoriesData.reset();
            //this.notifications.sendMessage(`${dataServer._result}`,'success');
            this._listArticles();
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
