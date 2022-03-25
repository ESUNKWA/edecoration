import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriesService } from 'src/app/core/services/categories/categories.service';
import { NotifService } from 'src/app/core/services/notif.service';
import { ProduitService } from 'src/app/core/services/produits/produit.service';
import { TarificationsService } from 'src/app/core/services/tarifications/tarifications.service';
import { UserService } from 'src/app/core/services/usersinfos/user.service';
import Swal from 'sweetalert2';
import { AdvancedSortableDirective } from '../tables/advancedtable/advanced-sortable.directive';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.scss']
})
export class ProduitsComponent implements OnInit {
  produitsData: FormGroup;
  tarificationData: FormGroup;
  ligneProduit: any = {};
  modeAppel: any;
  produitsTab: any[];
  modalTitle: any = '';
  breadCrumbItems: Array<{}>;
  @ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;

  categoriesTab: any[];
  idservice: any;
  ligneTarification: any = {};
  qteRetour: any;
  datastock: any = {};
  searChIn: any;
  viewTable: boolean = false;
  userData: any;
  
  constructor( private fb: FormBuilder, private produitServices: ProduitService, private notifications: NotifService,
                private modalService: NgbModal, private categorieServices: CategoriesService, 
                private taficationService: TarificationsService, private user: UserService ) { }

  ngOnInit(): void {
    this.userData = this.user._donnesUtilisateur()[0];
    this.breadCrumbItems = [{ label: 'Eden décoration' }, { label: 'Catégories de produits', active: true }];

    this.tarificationData = this.fb.group({
      p_produit: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      p_quantite: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      p_prix_location: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      p_duree: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      p_description: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]]
    });
    this.produitsData = this.fb.group({
      p_libelle: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      p_stock: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      p_categories: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      p_image: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      p_description: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]]
    });

    this._listProduits();
    this._listCategories();
  }

  _listCategories(): void {
    this.categorieServices._getCategories().subscribe(
      (data: any) => {
        this.categoriesTab = [...data._result];
        
      },
      (err) => {console.log(err.stack);
      }
    );
  }

  _listProduits(): void {
    this.produitServices._getproduits().subscribe(
      (data: any) => {
        this.produitsTab = [...data._result];
        setTimeout(() => {
          this.viewTable = true;
        }, 500);
      },
      (err) => {console.log(err.stack);
      }
    );
  }

  _saisieProduits(largeDataModal: any){
    this.modeAppel = 'creation';
    this.modalTitle = 'Saisie d\'une nouelle catégorie de produit';
    console.log(this.modeAppel);
    this.produitsData.reset();
    this.largeModal(largeDataModal);
  }

  _majQteRetour(){
    this.qteRetour = true;
  }

  _actionProduits(modal: any, categorie,action){
    this.ligneProduit = {...categorie};
    this.idservice = this.ligneProduit.r_categorie;
    
    
    switch (action) {

      case 'modif':
        this.modeAppel = 'modif';
        this.modalTitle = `Modification catégorie de produit [ ${this.ligneProduit.r_libelle} ]`;
        setTimeout(() => {
          this.largeModal(modal);
        }, 500);
       
      break;

      case 'tarification':
        this.modeAppel = 'tarif';
        this.modalTitle = `Tarification du produit [ ${this.ligneProduit.r_libelle} ]`;

        //Récupération de la tarification
        this.taficationService._getTarificationById(parseInt(this.ligneProduit.r_i,10)).subscribe(
          (response:any = {})=>{
            this.qteRetour = response._result.length;
            if( this.qteRetour >= 1 ){
              
              this.ligneTarification = {...response._result[0]};
             
              
            }else{
              this.tarificationData.reset();
            }
           
            console.log(this.ligneTarification, this.qteRetour);
          }
        );
        setTimeout(() => {
          this.largeModal(modal);
        }, 1000);
       
        break;
    
      default:
        Swal.fire({
          title: `[ ${this.ligneProduit.r_libelle} ] - Stock actuel : ${this.ligneProduit.r_stock}`,
          //input: 'number',
          html:
              '<input type="number" id="qte" placeholder="Quantité produit" class="swal2-input">' +
              '<input type="text" id="montant" placeholder="Montant achat" class="swal2-input">',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Enregistrer',
          cancelButtonText:'Annuler',
          showLoaderOnConfirm: true,
          preConfirm: () => {
            
          let qte, montantAchat;
          qte = (<HTMLInputElement>document.getElementById('qte')).value;
          montantAchat = (<HTMLInputElement>document.getElementById('montant')).value;
            
          if (qte == '' || qte == null) {
            Swal.showValidationMessage(
              `Veuillez saisir la quantité`
            );
            return;
          }

          if (montantAchat == '' || montantAchat == null) {
            Swal.showValidationMessage(
              `Veuillez saisir le montant d'achat`
            );
            return;
          }

            this.datastock.p_idproduit = this.ligneProduit.r_i;
            this.datastock.p_prix_achat = parseInt(montantAchat, 10);
            this.datastock.p_quantite =  parseInt(qte, 10);
            this.datastock.p_stock_actuel = this.ligneProduit.r_stock;
            this.datastock.p_description = '';
            this.datastock.p_utilisateur = 1;
          
          this.produitServices._addTrarification(this.datastock).subscribe(
            (response) =>{
              Swal.fire({
                title: `Succès`,
                text: `${response._result}`
              })
              this._listProduits();

            },
            (err)=> console.log(err)
            
          )  
          
          },
          allowOutsideClick: () => !Swal.isLoading()
        })
        break;
    }
    console.log(this.modeAppel);
  }

  

  _register(): void {
    
    this.produitsData.value.p_utilisateur = parseInt(this.userData.r_i, 10);;
    this.produitsData.value.p_categories = parseInt(this.idservice,10);
  
    
    

    switch (this.modeAppel) {
      case 'creation':
      
          this.produitServices._create(this.produitsData.value).subscribe(
            (dataServer: any) => {
              console.log(dataServer);
              
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
              this.produitsData.reset();

              this._listProduits();
            },
            (err: any) => {
              console.log(err);
            }
          );
        break;

      case 'modif':
        console.log(this.produitsData.value);
        
        this.produitServices._update(this.produitsData.value, this.ligneProduit.r_i).subscribe(
          (dataServer: any) => {
            this.produitsData.reset();
            this.notifications.sendMessage(`${dataServer._result}`,'success');
            this._listProduits();
          },
          (err: any) => {
            console.log(err);
          }
        );
      default:
        break;
    }
  }

  _registerTarification(){
    this.tarificationData.value.p_utilisateur = 1;
    this.tarificationData.value.p_produit = this.ligneProduit.r_i;

    this.taficationService._create(this.tarificationData.value).subscribe(
      (dataServer: any) => {
        console.log(dataServer);
        
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
        this.tarificationData.reset();

        //this._listProduits();
      },
      (err: any) => {
        console.log(err);
      }
    );

    console.log(this.tarificationData.value);
    
  }
  //Appel de la modal
  largeModal(exlargeModal: any) {
    this.modalService.open(exlargeModal, { size: 'lg', centered: true });
  }

}
