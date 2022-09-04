import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from '@fullcalendar/daygrid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ArticlesService } from 'src/app/core/services/articles/articles.service';
import { CryptDataService } from 'src/app/core/services/cryptojs/crypt-data.service';
import { FournisseursService } from 'src/app/core/services/fournisseurs/fournisseurs.service';
import { NotifService } from 'src/app/core/services/notif.service';
import { UserService } from 'src/app/core/services/usersinfos/user.service';
import { AdvancedSortableDirective } from '../../tables/advancedtable/advanced-sortable.directive';

@Component({
  selector: 'app-achats',
  templateUrl: './achats.component.html',
  styleUrls: ['./achats.component.scss']
})
export class AchatsComponent implements OnInit {


  // bread crum data
  breadCrumbItems: Array<{}>;
  @ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;

  datas: Observable<Table[]>;
  modalTitle: any = '';
  modeAppel: any = 'création';
    achatsTab: any = [];
    achatsData: FormGroup;
    ligneAchats: any = {};

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
  produitsTab: any[] = [];
  fournisseursTab: any[] = [];

    getPremiumData() {
      this.paginateData = this.achatsTab.slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      );

    }
  constructor(private modalService: NgbModal, private artcilesServices: ArticlesService,
    public fb: FormBuilder, private notifications: NotifService, private user: UserService,
    private cryptDataService: CryptDataService, private fournisseurServices: FournisseursService) { }


  ngOnInit(): void {
    this.userData = this.user._donnesUtilisateur()[0];

    this.breadCrumbItems = [{ label: 'Eden décoration' }, { label: 'Achat des produits', active: true }];

    this.achatsData = this.fb.group({
      r_produit: ['', [Validators.required]],
      r_fournisseur: ['', [Validators.required]],
      r_quantite: ['', [Validators.required]],
      r_prix_achat: ['', [Validators.required]],
      r_description: ['']
    });
    this._listAchats();
    this._listProduits();
    this._listFournisseurs();
  }

  get f () { return this.achatsData.controls;}

  _listAchats(): void {

  try {
    this.artcilesServices._list_achat_articles().subscribe(
      (data: any) => {

        let achats = this.cryptDataService.decrypt(data);
        this.achatsTab = [...achats.original._result];

        this.collectionSize = this.achatsTab.length;
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

  _listFournisseurs(): void {


    try {
      this.fournisseurServices._list().subscribe(
        (data: any) => {

          let dataReponseDecrypt = this.cryptDataService.decrypt(data);
          let result = dataReponseDecrypt.original;

        result._result.forEach((item) => {
          let obj:any = {};
          obj.value = item.id;
          obj.label = item.r_ets;
          this.fournisseursTab.push(obj);
        });

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
    this.modalTitle = 'Enregistrer un achat';
    this.achatsData.reset();

    this.largeModal(largeDataModal);
  }

  fctModiFourniss(largeDataModal: any, categorie){
    this.ligneAchats = {...categorie};

    this.modeAppel = 'modif';
    this.modalTitle = `Modification achat [ ${this.ligneAchats.r_nom_produit} ]`;


    this.largeModal(largeDataModal);
  }

  _resetForm() {
    this.achatsData.reset()
  }

  // cryptData(data: any = {}){

  //   let password = '123456';
  //   return CryptoJS.AES.encrypt(JSON.stringify(data), password,{
  //     format: this.JsonFormatter
  //   }).toString();
  // }

  _register(): void {

    // if (this.achatsData.invalid) {
    //   return;
    // }




    switch (this.modeAppel) {
      case 'creation':

        this.achatsData.value.r_creer_par = parseInt(this.userData.r_i, 10);
        let donnees = this.cryptDataService.crypt(this.achatsData.value);
          this.artcilesServices._achat_article({p_data:donnees}).subscribe(
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
              this.achatsData.reset();

              this._listAchats();
            },
            (err: any) => {
              console.log(err);
            }
          );
        break;

      case 'modif':

        this.achatsData.value.r_modifier_par = parseInt(this.userData.r_i, 10);
        let donneesUp = this.cryptDataService.crypt(this.achatsData.value);

        this.artcilesServices._update_achat({p_data:donneesUp}, this.ligneAchats.id).subscribe(
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

            this.achatsData.reset();
            //this.notifications.sendMessage(`${dataServer._result}`,'success');
            this._listAchats();
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

  //Liste des produits
  _listProduits(): void {
    this.artcilesServices._list().subscribe(
      (data: any) => {
        let dataReponseDecrypt = this.cryptDataService.decrypt(data);
        let result = dataReponseDecrypt.original;

        result._result.forEach((item) => {
          let obj:any = {};
          obj.value = item.id;
          obj.label = item.r_nom_produit;
          this.produitsTab.push(obj);
        });


      },
      (err) => {console.log(err.stack);
      }
    );
  }

}
