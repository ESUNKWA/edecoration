import { FournisseursService } from '../../../core/services/fournisseurs/fournisseurs.service';
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
  selector: 'app-fournisseurs',
  templateUrl: './fournisseurs.component.html',
  styleUrls: ['./fournisseurs.component.scss']
})
export class FournisseursComponent implements OnInit {

  // bread crum data
breadCrumbItems: Array<{}>;
@ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;

datas: Observable<Table[]>;
modalTitle: any = '';
modeAppel: any = 'création';
  fournisseursTab: any = [];
  fournisseursData: FormGroup;
  ligneFournisseur: any = {};

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
    this.paginateData = this.fournisseursTab.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );

  }

  constructor(private modalService: NgbModal, private fournisseurServices: FournisseursService,
    public fb: FormBuilder, private notifications: NotifService, private user: UserService,
    private cryptDataService: CryptDataService) { }

  ngOnInit(): void {
    this.userData = this.user._donnesUtilisateur()[0];

    this.breadCrumbItems = [{ label: 'Eden décoration' }, { label: 'Catégories de produits', active: true }];

    this.fournisseursData = this.fb.group({
      r_ets: ['', [Validators.required, Validators.minLength(2)]],
      r_nom_fournisseur: ['', [Validators.required, Validators.minLength(2)]],
      r_contact: ['', [Validators.required, Validators.minLength(10)]],
      r_lieu_de_vente: ['', [Validators.required]],
      r_produit_fourni: [''],
      p_description: ['']
    });
    this._listFournisseurs();
  }

  get f () { return this.fournisseursData.controls;}

  _listFournisseurs(): void {


  try {
    this.fournisseurServices._list().subscribe(
      (data: any) => {

        let fournisseurs = this.cryptDataService.decrypt(data);

        this.fournisseursTab = [...fournisseurs.original._result];

        this.collectionSize = this.fournisseursTab.length;
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
    this.modalTitle = 'Saisie un nouveau fournisseur';
    this.fournisseursData.reset();
    this.largeModal(largeDataModal);
  }

  fctModiFourniss(largeDataModal: any, fournisseur){

    this.ligneFournisseur = {...fournisseur};

    this.modeAppel = 'modif';
    this.modalTitle = `Modification du fournisseur [ ${this.ligneFournisseur.r_ets} ]`;


    this.largeModal(largeDataModal);
  }

  _resetForm() {
    this.fournisseursData.reset()
  }

  // cryptData(data: any = {}){

  //   let password = '123456';
  //   return CryptoJS.AES.encrypt(JSON.stringify(data), password,{
  //     format: this.JsonFormatter
  //   }).toString();
  // }

  _register(): void {

    if (this.fournisseursData.invalid) {
      return;
    }




    switch (this.modeAppel) {
      case 'creation':

        this.fournisseursData.value.r_creer_par = parseInt(this.userData.r_i, 10);
        let donnees = this.cryptDataService.crypt(this.fournisseursData.value);

          this.fournisseurServices._create({p_data: donnees}).subscribe(
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
              this.fournisseursData.reset();

              this._listFournisseurs();
            },
            (err: any) => {
              console.log(err);
            }
          );
        break;

      case 'modif':
        this.fournisseursData.value.r_modifier_par = parseInt(this.userData.r_i, 10);

        console.log(this.fournisseursData.value);


        let donneesUp = this.cryptDataService.crypt(this.fournisseursData.value);

        this.fournisseurServices._update({p_data:donneesUp}, this.ligneFournisseur.id).subscribe(
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
                this._listFournisseurs();
                break;
            }

            this.fournisseursData.reset();

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
