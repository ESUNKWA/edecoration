import { ArticlesService } from './../../../core/services/articles/articles.service';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
  @ViewChild('fileInput') inputEl: ElementRef;

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

    imageURL: string;
  formData: any =  new FormData();

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
      r_description: [''],
      r_image: ['']
    });
    this._listArticles();
  }

  get f () { return this.categoriesData.controls;}

  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.categoriesData.patchValue({
      r_image: file
    });
    this.categoriesData.get('r_image').updateValueAndValidity()
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  upload(event) {
    let fileList: FileList = event.target.files;
    let file: File = fileList[0];

    this.formData.append('uploadFile', file, file.name);
}

onFileSelect(event) {
  if (event.target.files.length > 0) {
    const file = event.target.files[0];
    this.categoriesData.get('r_image').setValue(file);
  }
}

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
    this.imageURL = this.ligneArticles.path_name;

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


    this.formData.append('r_nom_produit', this.categoriesData.get('r_nom_produit').value);
    this.formData.append('r_prix_vente', this.categoriesData.get('r_prix_vente').value);
    this.formData.append('r_stock', this.categoriesData.get('r_stock').value);
    this.formData.append('r_description', this.categoriesData.get('r_description').value);

    this.formData.append('r_image', this.categoriesData.get('r_image').value);
    console.log(this.categoriesData.value);
    //return;

    switch (this.modeAppel) {
      case 'creation':
        this.formData.append('r_creer_par', this.userData.r_i);
        //this.categoriesData.value.r_creer_par = parseInt(this.userData.r_i, 10);
        //let donnees = this.cryptDataService.crypt(this.formData);
          this.artcilesServices._create(this.formData).subscribe(
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
        this.formData.append('r_modifier_par', parseInt(this.userData.r_i, 10));
        this.formData.append('idproduit', this.ligneArticles.id);
        //let donneesUp = this.cryptDataService.crypt(this.categoriesData.value);

        this.artcilesServices._update(this.formData).subscribe(
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
                this.categoriesData.reset();
                this._listArticles();
                location.reload();
                break;
            }

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
