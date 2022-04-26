import { Component, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommunesService } from 'src/app/core/services/communes/communes.service';
import { LocationService } from 'src/app/core/services/location/location.service';
import { LogistikService } from 'src/app/core/services/logistik/logistik.service';
import { NotifService } from 'src/app/core/services/notif.service';
import { TarificationsService } from 'src/app/core/services/tarifications/tarifications.service';
import { UserService } from 'src/app/core/services/usersinfos/user.service';
import { AdvancedSortableDirective } from '../tables/advancedtable/advanced-sortable.directive';
import { NotificationService } from '@progress/kendo-angular-notification';

import * as moment from 'moment';

import pdfmake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DataprintformatService } from 'src/app/core/services/dataprintformat/dataprintformat.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
pdfmake.vfs = pdfFonts.pdfMake.vfs;

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
modeAppel: any = 'creation';
tarificationTab: any = [];
produitsTab: any = [];
viewTable: boolean = false;
  recapTab: any;
  totalLocation: any={};
  totalLocationModif: any = {};
  selectValue: any[];
  logistik: boolean;
  selectedCityarrive: any;
  selectedCityDapart: any;
  remisepercent: any;
  remisemnt: any;
  remisenewmnt: any;

  locationData: FormGroup;
  clientsData: FormGroup;
  showLocationData: FormGroup;
  reglmntData: FormGroup;
  searchData: FormGroup;
  valremise: any = 0;

  CommunesTab: any = [];
  logistkTab: any = [];
  locationtab: any = [];
  interface: any = 'liste';
  ligneLocation: any = {};
  detailsLocationTab: any = [];
  dateEnvoie: any;
  dateretour: any;
  selectDemandeStat: any;

  libDatedete: any = 'Date de livraison';

  demandeStat: any = [
    {
      value: "null",
      label: '---Tous sélectionner---'
    },
    {
      value: 0,
      label: 'Locations en attente de validation'
    },
    {
      value: 1,
      label: 'Locations validée et en cours'
    },
    {
      value: 2,
      label: 'Locations terminée'
    },
    {
      value: 3,
      label: 'Locations annulée'
    }
  ];

  submit: boolean = false;

  cboDefaultValue: any;
  selectedVehicule: any;
  majStatusData: any = {};
  dateData: any = {};
  nbreJrLocation: any = 1;
  modeDate: number;
  btnValidation: any;
  desactiver: boolean = false;
  addproduct: boolean = false;
  term: any;

  reliquat: any;

  //Paginations
  premiumData: any[] = [];
  paginateData: any[] = [];
  source$: Observable<any>;
  page = 1;
  pageSize = 5; //Nbre de ligne à afficher
  collectionSize = 0;
  reglmtPartiel: any;
  mntAvance: any;

  resetWizard: boolean = false;
  paramsPaiement: any = {};
  paymntTab: any;
  totalPaiement: any;
  mntPaiement: any;
  desc: any;
  typetext: any;
  dkem: string;

  getPremiumData() {
    this.paginateData = this.locationtab.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );

  }

  constructor(private notifications: NotifService, private user: UserService, private modalService: NgbModal, private tarifService: TarificationsService,
              private fb: FormBuilder, private communeService: CommunesService, private logistkService: LogistikService, private location: LocationService,
              private exportpdf: DataprintformatService, private notificationService: NotificationService) { }

              public showSuccess(): void {
                this.notificationService.show({
                  content: 'Success notification',
                  hideAfter: 600,
                  position: { horizontal: 'center', vertical: 'top' },
                  animation: { type: 'fade', duration: 1000 },
                  type: { style: 'success', icon: true },
                });
              }          

  ngOnInit(): void {
    this.userData = this.user._donnesUtilisateur()[0];

    this.cboDefaultValue = "null";

    this.locationData = this.fb.group({
      p_details: ['', [Validators.required]],
      p_nom: ['', [Validators.required]],
      p_prenoms: ['', [Validators.required]],
      p_telephone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      p_email: [''],
      p_description: [''],
      p_date_envoie: ['',[Validators.required]],
      p_date_retour: ['',[Validators.required]],
      p_commune_depart: ['',[Validators.required]],
      p_commune_arrive: ['',[Validators.required]],
      p_vehicule: [''],
      p_paiement:[''],
      p_frais: [0],
    });
    this.showLocationData = this.fb.group({
      p_details: ['', [Validators.required]],

      p_description: [''],
      p_date_envoie: ['',[Validators.required]],
      p_date_retour: ['',[Validators.required]],
      p_commune_depart: ['',[Validators.required]],
      p_commune_arrive: ['',[Validators.required]],
      p_vehicule: [''],
      p_frais: [0],
    });
    this.clientsData = this.fb.group({
      p_nom: ['', [Validators.required]],
      p_prenoms: ['', [Validators.required]],
      p_telephone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      p_email: [''],
      p_description: ['']
    });
    this.searchData = this.fb.group({
      p_date: ['', [Validators.required]],
      p_date_retour: ['', ],
      p_status: ['',[Validators.required]]
    });
    this.reglmntData = this.fb.group({
      p_avancePayer: [],
      p_mntverse: [],
      p_description: []
    });

    this.breadCrumbItems = [{ label: 'Eden décoration' }, { label: 'Liste des locations', active: true }];

    this.totalLocation.qteproduits = 0;
    this.totalLocation.mntTotal = 0;
    this.totalLocation.mewTotal = 0;
    this.modeDate = 1;

    this._listProduits();
    this._listCommunes();
    this._listLogistik();

    //this.selectedCityDapart = this.CommunesTab[8];
  }

  get formvalidate() { return this.locationData.controls;}
  get searchValidate() { return this.searchData.controls;}


  _dateOption(option){
    switch (option) {

      case 'option1':
          this.libDatedete = 'Date de livraison';
           this.modeDate = 1;
        break;

      case 'option2':
          this.libDatedete = 'Date de retour';
          this.modeDate = 2;
         break;

      case 'option3':
            this.libDatedete = 'Date de livraison';
            this.modeDate = 3;
          break;

      default:
        break;
    }


  }

  _moderglmnt(val){
    this.reglmtPartiel=parseInt(val,10);
    this.mntAvance = (this.reglmtPartiel == 2)? null : this.mntAvance;
  }

  //Calcul de la remise de la remise
  _calculateRemise(val, typeremise){
      switch (typeremise) {
        case 'percent':
          this.remisemnt = 0;
          this.remisenewmnt = 0;
          const valeur1 = parseInt(val, 10) * (1/100);
          this.totalLocation.mewTotal = (this.totalLocation.mntTotal - (this.totalLocation.mntTotal * valeur1)) * this.nbreJrLocation;
          break;

        case 'mntfixe':
          this.remisepercent = 0;
          this.remisenewmnt = 0;
          const valeur2 = parseInt(val, 10);
          this.totalLocation.mewTotal = ((this.totalLocation.mntTotal* this.nbreJrLocation) - valeur2) ;
          break;

        case 'newmnt':
          this.remisepercent = 0;
          this.remisemnt = 0;
          const valeur3 = parseInt(val, 10);
          this.totalLocation.mewTotal = valeur3;
          this.valremise = (this.totalLocation.mntTotal - valeur3) * this.nbreJrLocation;
          break;
      }
      this.valremise = this.remisepercent || this.remisemnt || this.remisenewmnt;

  }

  //Calcule réliquat
  _calculReliquat(val) {
    this.mntAvance = parseInt(val,10)
    this.reliquat = (this.totalLocation.mewTotal || this.totalLocation.mntTotal) - this.mntAvance;
  }

  _gestionLogistik(val: boolean): void {
    this.logistik = val;
  }

  //sélection quantité par produit
  _valueQte(val,i){
    
    this.totalLocation = {};


    switch (this.modeAppel) {

      case 'manquant':
          //Modification de la ligne en cours
        this.detailsLocationTab[i].p_qte_manqant = parseInt(val, 10);
        
        break;

      case 'creation':

      //Modification de la ligne en cours
        this.tarificationTab[i].qte = parseInt(val, 10);
        this.tarificationTab[i].total =  this.tarificationTab[i].qte*this.tarificationTab[i].r_prix_location;

        if( this.tarificationTab[i].qte > this.tarificationTab[i].r_stock){
          this.notifications.sendMessage('Stock insuffisant','warning');
          this.tarificationTab[i].qte = 0;
          return false;
        }

        this.recapTab = this.tarificationTab.filter( el => el.qte >= 1);
          //Calcul de la somme total et du nombre total de produits de la location
          switch (this.recapTab.length) {
            case 1:
              this.totalLocation.mntTotal = this.tarificationTab[i].total;
              this.totalLocation.qteproduits = this.tarificationTab[i].qte;

              break;

            default:

              //const a = this.recapTab.reduce((a, b) => ({total: a.total + b.total}));
              const a = this.recapTab.reduce(function (acc, obj) { return acc + obj.total; }, 0);
              const b = this.recapTab.reduce(function (acc, obj) { return acc + obj.qte; }, 0);

              this.totalLocation.mntTotal = a;
              this.totalLocation.qteproduits = b;
              break;
          }
        break;

      default:

      //Modification de la ligne en cours
      this.detailsLocationTab[i].r_quantite = parseInt(val, 10);
      this.detailsLocationTab[i].r_sous_total =  this.detailsLocationTab[i].r_quantite*this.detailsLocationTab[i].r_prix_location;

      if( this.detailsLocationTab[i].r_quantite > this.detailsLocationTab[i].r_stock){
        this.notifications.sendMessage('Stock insuffisant','warning');
        this.detailsLocationTab[i].r_quantite = 0;
        return false;
      }

      this.recapTab = this.detailsLocationTab.filter( el => el.r_quantite >= 1);
        //Calcul de la somme total et du nombre total de produits de la location
        switch (this.recapTab.length) {
          case 1:
            this.totalLocationModif.mntTotal = this.detailsLocationTab[i].total;
            this.totalLocationModif.qteproduits = this.detailsLocationTab[i].qte;

            break;

          default:

            //const a = this.recapTab.reduce((a, b) => ({total: a.total + b.total}));
            const a = this.recapTab.reduce(function (acc, obj) { return acc + obj.r_sous_total; }, 0);
            const b = this.recapTab.reduce(function (acc, obj) { return acc + obj.r_quantite; }, 0);

            this.totalLocationModif.mntTotal = a;
            this.totalLocationModif.qteproduits = b;

            break;
        }
        break;
    }




    // tslintthis.detailsLocationTab = [...this.tarificationTab]

  }

  //Liste des communes
  _listCommunes(): void {
    this.communeService._getCommunes().subscribe(
      (data: any) => {
        this.CommunesTab = [...data._result];
        this.selectedCityDapart = this.CommunesTab[2].value;
      },
      (err) => {console.log(err.stack);
      }
    );
  }

  //Liste des véhicules
  _listLogistik(): void {
    this.logistkService._getlogistik().subscribe(
      (data: any) => {
        this.logistkTab = [...data._result];
      },
      (err) => {console.log(err.stack);
      }
    );
  }

  //Cocher la ligne produit à sélectionner
  _changeValcheck(val,i){

    this.tarificationTab[i].check = val;
    if(val == false){
      this.tarificationTab[i].qte = 0;
      this.tarificationTab[i].total =  this.tarificationTab[i].qte*this.tarificationTab[i].r_prix_location;
    }

    this.recapTab = this.tarificationTab.filter( el => el.qte >= 1);

  }


  _registerLocations(){

    if( (this.reglmtPartiel == 1 && this.mntAvance == undefined) || (this.reglmtPartiel == 1 && this.mntAvance == null) ){ 
      this.notifications.sendMessage('Veuillez saisir le montant de l\'`avance','warning');
      return;
    }

    this.locationData.value.p_details = this.recapTab;
    this.locationData.value.p_mnt_total = this.totalLocation.mntTotal * this.nbreJrLocation;
    this.locationData.value.p_remise = parseInt(this.valremise, 10);
    this.locationData.value.p_mnt_total_remise = this.totalLocation.mewTotal;
    this.locationData.value.p_vehicule = this.locationData.value.p_vehicule?.value;

    this.locationData.value.p_commune_depart = this.selectedCityDapart;
    this.locationData.value.p_commune_arrive = this.selectedCityarrive?.value;
    this.locationData.value.p_duree = this.nbreJrLocation;
    this.locationData.value.p_utilisateur = this.userData.r_i;
    this.locationData.value.p_signe = "-";
    //this.locationData.value.p_avance = this.mntAvance;
    //this.locationData.value.p_reglmnt_total = (this.reglmtPartiel == 1)? false : true;
    //this.locationData.value.p_solder = (this.reglmtPartiel == 1)? false : true;

    this.locationData.value.p_date_envoie = this.locationData.value.p_date_envoie.replace('T', ' ');
    this.locationData.value.p_date_retour = this.locationData.value.p_date_retour.replace('T', ' ');

    if( this.reglmtPartiel == 1 ){
      this.locationData.value.p_solder = false;
      this.paramsPaiement.p_mntverse = this.mntAvance;
      this.paramsPaiement.p_utilisateur = this.userData.r_nom + " " + this.userData.r_prenoms;
      this.paramsPaiement.p_description = "";
      this.paramsPaiement.p_date_creation = "";
      this.locationData.value.p_paiement = [this.paramsPaiement];
    }else{
      this.locationData.value.p_solder = true;
      this.locationData.value.p_paiement = "";
    }

    this.location._create(this.locationData.value,1).subscribe(
      (data: any = {})=>{

        if( data._status == 1){
          this.notifications.sendMessage(data._result,'success');
          this.locationData.reset();
          this.reliquat = null;
          this._listProduits();
          this.recapTab = {};
          
          this.nbreJrLocation = 0;
          this.remisemnt = 0;
          this.remisepercent = 0;
          this.remisenewmnt = 0;
          this.totalLocation = {};
          this.resetWizard = true;
        }

        //this.nbreJrLocation = 0;
      },
      (err)=>{console.log(err);
      }
    );

  }

  _actionLocation(largeDataModal,ligneLocation, mode){

    this.ligneLocation = {...ligneLocation};

    this.dateEnvoie = this.ligneLocation.r_date_envoie.replace(' ', 'T');
    this.dateretour = this.ligneLocation.r_date_retour.replace(' ', 'T');
    this.selectedCityarrive = this.ligneLocation.r_destination;

    this.selectedVehicule = this.ligneLocation.r_logistik;

    this.logistik = (this.ligneLocation.r_frais_transport == 0)? false: true;

    this.paymntTab = (this.ligneLocation.r_paiement_echell !== "null")? [...JSON.parse(this.ligneLocation.r_paiement_echell)] : "null";
    //Sommes total des paiements
    if( this.paymntTab !== "null" ){
      this.totalPaiement = this.paymntTab?.reduce(function (acc, obj) { return acc + obj.p_mntverse; }, 0);
      this.mntPaiement = this.ligneLocation.r_mnt_total_remise - this.totalPaiement;
      
    }
    
    if( this.ligneLocation.r_solder){
      this.typetext = 'success';
      this.dkem = "facture réglée";
    }else{
      this.typetext = 'danger';
      this.dkem = "facture non réglée";
    } 
    
    // Pour permettre la saisir et la récupération en parameters des produits manquant après retour
    if( this.ligneLocation.r_status !== 0 ){
      this.modeAppel = 'manquant';
    }
    
    switch(mode){
      case 'modif':

        this._listDetailLocationByidLocation(this.ligneLocation.r_i);
        this.modalTitle = `Modification de la location N° [ ${this.ligneLocation.r_num} ]`;
        this.desactiver = false;
        this.clientsData.enable();
        this.showLocationData.enable();
        this._produits();
        this.largeModal(largeDataModal)
        break;

      case 'validation':
        this.btnValidation = 'validation';
        this._listDetailLocationByidLocation(this.ligneLocation.r_i);
        this.modalTitle = `Validation de la location N° [ ${this.ligneLocation.r_num} ]`;
        this.desactiver = true;
        this.clientsData.disable();
        this.showLocationData.disable();
        this._produits();
        this.largeModal(largeDataModal)
        break;

      default:

        this.detailsLocationTab = [];
        let totalMnt = []
        let dataPrint: any = [];
        let dataPrintTitle: any = ['Produits','Quantités','Prix unitaire','Sous total'];

        dataPrint.push(dataPrintTitle);

        this.location._getDetailLocationByid(this.ligneLocation.r_i).subscribe(
          (data: any) => {
            this.detailsLocationTab = [...data._result];

            //Produts à imprimer
            this.detailsLocationTab.forEach((el)=>{
              let obj: any = {}
              obj.produit = el.lib_produit,
              obj.quantite = el.r_quantite,
              obj.prix_location = el.r_prix_location,
              obj.sous_total = el.r_sous_total

              dataPrint.push(obj);
            });
            dataPrint.push([{text: 'Total', colSpan:3},'','', {text:this.ligneLocation.r_mnt_total/this.ligneLocation.r_duree, color: "green"}]);
            dataPrint.push([{text: 'Durée', colSpan:3},'','', {text:this.ligneLocation.r_duree, color: "red"}]);
            dataPrint.push([{text: 'Rémise', colSpan:3},'','', this.ligneLocation.r_remise]);
            dataPrint.push([{text: 'Total TTC', colSpan:3},'','', {text:this.ligneLocation.r_mnt_total, color: "blue"}]);
           //Formatage des données pour la génération du pdf
            let dd = this.exportpdf.printData(dataPrint);

            this.export(dd, this.ligneLocation);
            dd = [];
            dataPrintTitle = [];
            dataPrint = [];


          },
          (err) => {console.log(err.stack);
          }
        );

        break;
    }
  }


  _search_location(dataRequest: any): void{
    this.submit = true;
    this.viewTable = false;

    if (this.searchData.invalid) {
      this.viewTable = true;
      return;
    }


    //this.location._getLocations(this.cboDefaultValue,this.searchData.value.p_date.split('T')[0]).subscribe(
    this.location._getLocationByCrteres(dataRequest).subscribe(
      (res: any)=>{
        this.locationtab = [...res._result];
        this.collectionSize = this.locationtab.length;
        this.getPremiumData();
        //this.modeDate = null;
        setTimeout(() => {
          this.viewTable = true;
        }, 500);
      }
    )
  }

  _exe_search_location(){

    this.searchData.value.p_date = this.searchData.value.p_date.split('T')[0];
    this.searchData.value.p_date_retour = this.searchData.value.p_date_retour?.split('T')[0];
    this.searchData.value.p_mode = this.modeDate;
    //this.searchData.value.p_status = this.p_status;

    //this._search_location(this.cboDefaultValue,this.searchData.value.p_date.split('T')[0],this.modeDate);
    this._search_location(this.searchData.value);
  }


  _listProduits(): void {
    this.tarifService._getTarifications().subscribe(
      (data: any) => {
        this.tarificationTab = [...data._result];


        setTimeout(() => {
          this.viewTable = true;

        }, 200);
      },
      (err) => {console.log(err.stack);
      }
    );
  }

  _produits(){
    let obj;
    this.tarificationTab.forEach((el)=>{
        obj = {};
        obj.value = el.idproduit;
        obj.label = el.r_libelle;
        obj.prixLocation = el.r_prix_location;
        this.produitsTab.push(obj)
    });

  }

  _listDetailLocationByidLocation(idlocation: number) {

    this.location._getDetailLocationByid(idlocation).subscribe(
      (data: any) => {
        this.detailsLocationTab = [...data._result];

        setTimeout(() => {
          this.viewTable = true;
        }, 500);

      },
      (err) => {console.log(err.stack);
      }
    );
  }

  _print(idlocation: number) {

    this.location._getDetailLocationByid(idlocation).subscribe(
      (data: any) => {
        this.detailsLocationTab = [...data._result];

        setTimeout(() => {
          this.viewTable = true;
        }, 500);

      },
      (err) => {console.log(err.stack);
      }
    );
  }

  _saisie_location(){
    this.modeAppel = 'creation';
    this.interface = 'saisie';
    //this.selectedCityDapart = '';
    this.selectedCityarrive = '';
    this._listProduits();

  }
  _affiche_location(){
    this.interface = 'liste';
    //this._search_location(this.searchData.value);

  }
  
  _majStatuslocation(data){
    let obj: any = {},tab: any =[];
    this.majStatusData.p_idlocation = parseInt(this.ligneLocation.r_i, 10);
    this.majStatusData.p_status = data;

    this.detailsLocationTab.forEach((el)=>{
      obj = {};
        obj.idproduit = el.r_produit;
        obj.qte = el.r_quantite;
        obj.qteManquant = (el.p_qte_manqant == undefined)? 0 :el.p_qte_manqant;
        obj.p_iddLocation = el.r_i;
        tab.push(obj);
    });
    this.majStatusData.p_details = tab;
    this.majStatusData.p_signe = "+";

    Swal.fire({
      title: 'Terminer la location',
      text: "Avez vous Vérifier la quantité des produits retournés?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, J\'ai vérifié!',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        this.location._majStatusLocation(this.majStatusData).subscribe(
          (response: any) => {
    
            if( response._status == 1 ){
    
              switch(this.majStatusData.p_status) {
    
                case 0:
                  this.notifications.sendMessage('La demande de location à été rejetté','warning');
                  break;
    
                case 1:
                  this.notifications.sendMessage('La demande de location à bien été validée','success');
                  break;
    
                case 2:
                    this.notifications.sendMessage('Location terminée','success');
                    break;
    
                case 3:
                    this.notifications.sendMessage('Location annulée','success');
                    break;
    
              }
              this._search_location(this.searchData.value);
    
            }
            this.modalService.dismissAll('close');
          },
          (err) => {console.log(err.stack)}
        )
      }
    })

  }


  _reglmntArriere(){
    const d = new Date();
    let mois = d.getMonth();
    let b: any = {};
    
    //this.reglmntData.value.p_idlocation = this.ligneLocation.r_i;
    this.reglmntData.value.p_date_creation = d.getDate() + '-' + ((mois < 10 )? '0'+mois : mois) + '-' + d.getFullYear();
    this.reglmntData.value.p_utilisateur = this.userData.r_nom + ' ' + this.userData.r_prenoms;
    this.reglmntData.value.p_mntverse = parseInt(this.reglmntData.value.p_mntverse,10);
    
    //-----------------------//-----------------------//--------------------------//
    this.totalPaiement = this.paymntTab?.reduce(function (acc, obj) { return acc + obj.p_mntverse; }, 0);
    
    this.paymntTab.push(this.reglmntData.value);

    b.p_idlocation = this.ligneLocation.r_i;
    b.p_paiement = this.paymntTab;
    b.p_mnt_total_paie = parseInt(this.totalPaiement,10) + parseInt(this.mntPaiement,10);
  

    this.location._add_reglmnt_paiemnt(b).subscribe(
      (data: number) => {
        
        if(data){
          this.notifications.sendMessage('Enregistrement effectué avec success','success');
          this.modalService.dismissAll('close');
          this._search_location(this.searchData.value);
        }
      },
      (err: any = {}) => {console.log(err.stack);
      }
    )
    
  }

  _getdatedebut(){
    const a = this.locationData.value.p_date_envoie.split('T')[0];
    this.dateData.debut = [...a.split('-')];
  }

  _getdatefin(){
    const a = this.locationData.value?.p_date_retour.split('T')[0];
    this.dateData.fin = [...a.split('-')];

    let c = moment(this.dateData.fin);
    let d = moment(this.dateData.debut);
    this.nbreJrLocation = c.diff(d, 'days');
    this.totalLocation.mewTotal = this.totalLocation.mntTotal * this.nbreJrLocation;
    this.remisepercent = 0;
    this.remisemnt = 0;
    this.remisenewmnt = 0;
  }

  //Appel de la modal
  largeModal(exlargeModal: any) {
    this.modalService.open(exlargeModal, { size: 'xl', centered: true });
  }
  //Supprimer produits dans le panier
  SuprimeChamps(index){
    this.detailsLocationTab.splice(index,  1);
  }
  //Afficher ou caher le contenu pour l'ajout des produits
  _addProdut(val: boolean) {
    //debugger
      this.addproduct = val;
      //this.detailsLocationTab = [];
      //this.modeAppel = (val == false) ? 'modif': 'creation';

      if( this.addproduct == true ) {
        this.modeAppel = 'creation';
        //this.detailsLocationTab.splice(1,this.detailsLocationTab.length)
      }else{
        this.modeAppel = 'modif';
      }

      if( this.recapTab?.length >= 1){
        this.recapTab?.map(product=>{

          if( this.recapTab.includes(product.idproduit) == false ){
            return this.detailsLocationTab.push({
              r_produit: product.idproduit,
              r_quantite: product.qte,
              r_prix_location: product.r_prix_location,
              r_sous_total: product.total,
            })
          }
        });
      }
      this.recapTab = [];
  }


  //PDF
  public export(data, dataClient): void {

    //this._listDetailLocationByidLocation(this.ligneLocation.r_i);

    const docDefinition = {


      footer: {
        columns: [
          'Left part',
          { text: 'Right part', alignment: 'right' }
        ]
      },


      content: [

        {
          columns: [
            [
              {
                text: 'Facture N° : ' + dataClient.r_num,

              },
              {
                text: dataClient.created_at
              }
            ]
          ],
          style: 'facture'
        },

        {
          columns: [
            [{
              text: 'Boutique/Commerce :',
              decoration: 'underline'
            },
            // {
            //   text: "this.infosPatenaire[0].r_nom"
            // },
            // {
            //   text: "this.infosPatenaire[0].r_quartier"
            // },
            // {
            //   text:"this.infosPatenaire[0].email || '',"
            // },
            // {
            //   text: "this.infosPatenaire[0].phone || ''",
            // }
            ],
          ],

        },
        {
          columns: [
            [{
              text: 'A : Client/ Destinataire :',
              decoration: 'underline'
            },
              {
                text: dataClient.r_nom + ' ' + dataClient.r_prenoms,
                style: 'nomclient'
              },
              {
                text: dataClient.r_telephone || 'Pas de numéro',
                style: 'phoneclient'
              },
              {
                text: 'Abidjan',
                style: 'ville'
              }
            ]
          ],
          alignment: 'right'
        },
        {
          text: 'Intitulé: Produits facturés',
          style: 'header'
        },


        {
          style: "tableExample",
          table: {
            headerRows: 1,
            widths: [ '*', '*', '*', '*'],
            body: data
          }
        },

        {
          columns: [
            [{
              text: 'En votre aimable règlement'
            },
            {
              text: 'Cordialement'
            },
            {
              text: 'Devise de l’opération est le Franc cfa (Fcfa).'
            }]
          ],
          style: 'note'
        }

      ],



      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        }
      }
    };

    pdfmake.createPdf(docDefinition).open();
  }

}
