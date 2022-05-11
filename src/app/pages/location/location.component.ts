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

import * as moment from 'moment';

import pdfmake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DataprintformatService } from 'src/app/core/services/dataprintformat/dataprintformat.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
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
  recapTab: any = [];
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
  selectedProductIds: number[];
  tarificationTabCiblees: any = [];
  tabindex: any = 0;
  nbreLigne: number;
  produitsTabLoues: any[] = [];

  getPremiumData() {
    this.paginateData = this.locationtab.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );

  }

  constructor(private notifications: NotifService, private user: UserService, private modalService: NgbModal, private tarifService: TarificationsService,
              private fb: FormBuilder, private communeService: CommunesService, private logistkService: LogistikService, private location: LocationService,
              private exportpdf: DataprintformatService, private toastr: ToastrService) { }          

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
    let mntSai: any;
    mntSai = val.split(' ').join('')
    this.mntAvance = parseInt(mntSai,10);
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
            this.totalLocationModif.mntTotal = this.detailsLocationTab[i].total || this.detailsLocationTab[i].r_sous_total;
            this.totalLocationModif.qteproduits = this.detailsLocationTab[i].qte || this.detailsLocationTab[i].r_quantite;

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

    this.locationData.value.p_date_envoie = this.locationData.value.p_date_envoie.replace('T', ' ');
    this.locationData.value.p_date_retour = this.locationData.value.p_date_retour.replace('T', ' ');

    if( this.reglmtPartiel == 1 ){
      this.locationData.value.p_solder = false;
      this.paramsPaiement.p_mntverse = this.mntAvance;
      this.paramsPaiement.p_utilisateur = this.userData.r_nom + " " + this.userData.r_prenoms;
      this.paramsPaiement.p_description = "";
      this.paramsPaiement.p_date_creation = this.getDateJour();
      this.locationData.value.p_paiement = [this.paramsPaiement];
    }else{
      this.locationData.value.p_solder = true;
      this.locationData.value.p_paiement = "";
    }

    this.location._create(this.locationData.value,1).subscribe(
      (data: any = {})=>{

        if( data._status == 1){
          
          this.notifications.sendMessage(data._result,'success');
      
          this.reliquat = null;
          this.recapTab = [];
          
          this.nbreJrLocation = 0;
          this.remisemnt = 0;
          this.remisepercent = 0;
          this.remisenewmnt = 0;
          this.totalLocation = {};
          this.dateData = {};
          this._listProduits();
          this.locationData.reset();
          
        }

        //this.nbreJrLocation = 0;
      },
      (err)=>{console.log(err);
      }
    );

  }

  //Total paiement echellonné et total réliquat
  _sommes(){
    this.totalPaiement = this.paymntTab?.reduce(function (acc, obj) { return acc + obj.p_mntverse; }, 0);
    this.mntPaiement = this.ligneLocation.r_mnt_total_remise - this.totalPaiement;
  }

  _actionLocation(largeDataModal,ligneLocation, mode){
    
    this.nbreLigne = 0;
    this.tarificationTabCiblees = [];
    this.ligneLocation = {...ligneLocation};

    // Affecter les dates aux champs dateheure pour consultation
    this.dateEnvoie = this.ligneLocation.r_date_envoie.replace(' ','T');
    this.dateretour = this.ligneLocation.r_date_retour.replace(' ','T');
    //Récupération du nombre de jour
    let debut = moment(this.ligneLocation.r_date_envoie);
    let fin = moment(this.ligneLocation.r_date_retour);
    this.nbreJrLocation = fin.diff(debut, 'days');
    

    this.selectedCityarrive = this.ligneLocation.r_destination;

    this.selectedVehicule = this.ligneLocation.r_logistik;

    this.logistik = (this.ligneLocation.r_frais_transport == 0)? false: true;

    this.paymntTab = (this.ligneLocation.r_paiement_echell !== "null")? [...JSON.parse(this.ligneLocation.r_paiement_echell)] : "null";
    //Sommes total des paiements
    if( this.paymntTab !== "null" ){
      this._sommes();
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
        this.btnValidation = '';
        this.modeAppel = 'modif';
        this._listDetailLocationByidLocation(this.ligneLocation.r_i);
        this.modalTitle = `Modification de la location N° [ ${this.ligneLocation.r_num} ]`;
        this.desactiver = false;
        this.clientsData.enable();
        this.showLocationData.enable();
        
        this._produits();
        this.largeModal(largeDataModal);
       
        
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
        this.btnValidation = '';
        this.detailsLocationTab = [];

        let dataPrint: any = [];
        let dataPrintTitle: any = [
                                    {text:'Produits', bold:true, italics: true,alignment:"center",},
                                    {text:'Quantités', bold:true, italics: true,alignment:"center",},
                                    {text:'Prix unitaire', bold:true, italics: true,alignment:"center",},
                                    {text:'Sous total', bold:true, italics: true,alignment:"center",}
                                  ];

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
            dataPrint.push([{text: '-------------------------------------------------------------------------------------------------------------------',
                background:"#ACACAC", color: "#ACACAC",alignment:"justify",colSpan:4, }]);
            dataPrint.push([{text: 'Sous total', colSpan:3},'','', {text:this.ligneLocation?.r_mnt_total/this.ligneLocation?.r_duree, color: "green"}]);
            dataPrint.push([{text: 'Durée (Jours)', colSpan:3},'','', {text:this.ligneLocation?.r_duree, color: "red"}]);
            dataPrint.push([{text: 'Montant total sur la durée', colSpan:3},'','', {text:this.ligneLocation?.r_mnt_total, color: "black"}]);
            dataPrint.push([{text: 'Rémise', colSpan:3},'','', (this.ligneLocation?.r_remise >= 100)? this.ligneLocation?.r_remise : this.ligneLocation?.r_remise + '%']);

            dataPrint.push([{text: 'Total après rémise', colSpan:3},'','', {text: parseInt(this.ligneLocation?.r_mnt_total_remise), color: "blue"}]);

            dataPrint.push([{text: '-------------------------------------------------------------------------------------------------------------------',
                background:"#ACACAC", color: "#ACACAC",alignment:"justify",colSpan:4, }]);

            dataPrint.push([{text: 'Expédition', colSpan:3},'','', {text: this.ligneLocation?.r_frais_transport, color: "black"}]);

            dataPrint.push([{text: 'Total à payer', colSpan:3},'','', 
            {text: parseInt(this.ligneLocation?.r_mnt_total_remise) + parseInt(this.ligneLocation?.r_frais_transport), color: "blue"}]);

            dataPrint.push([{text: '-------------------------------------------------------------------------------------------------------------------',
                background:"#ACACAC", color: "#ACACAC",alignment:"justify",colSpan:4},'','', {text: ""}]);

            if( this.paymntTab !== "null" ){
              dataPrint.push([{text: 'Avance', colSpan:3},'','', {text: (this.ligneLocation.r_solder !== 0)? 0 : this.totalPaiement, color: "black"}]);
              dataPrint.push([{text: 'Réliquat', colSpan:3},'','', {text:  this.ligneLocation?.r_mnt_total_remise - this.totalPaiement, color: "black"}]);
            }

            

            // Données transport produits
            // tranportData.push([{text: 'Frais'},{text:this.ligneLocation?.r_frais_transport}]);
            // tranportData.push([{text: 'Véhicule'},{text:this.ligneLocation?.r_vehicule + ' | ' +this.ligneLocation?.r_matricule}]);
            // tranportData.push([{text: 'Destination'},{text:this.ligneLocation?.destination}]);
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
    let tb: any = []
    this.location._getDetailLocationByid(idlocation).subscribe(
      (data: any) => {
        this.detailsLocationTab = [...data._result];
        this.nbreLigne = this.detailsLocationTab.length;

        //Récupération des premières quantités louées
        this.detailsLocationTab.map(item =>{
          return tb.push({
             qte: item.r_quantite,
            idproduit: item.r_produit,
           }); 
       });
       this.produitsTabLoues = tb;
      
       // total montant de la location à modifier
       const b = this.detailsLocationTab.reduce(function (acc, obj) { return acc + obj.r_sous_total; }, 0);
        this.totalLocationModif.mntTotal = b;

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
  
  _majStatuslocation(data,title,msg){
    let obj: any = {},tab: any =[], notif;
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
      title: title,
      text: msg,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui',
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

  getDateJour(){
    const d = new Date();
    let mois = d.getMonth() + 1;
    let datejour = d.getDate();

    return d.getFullYear() + '-' + ((mois < 10 )? '0'+mois : mois) + '-' + ((datejour < 10 )? '0'+datejour : datejour);
  }

  
  _reglmntArriere(){
    
    let b: any = {};
    
    //this.reglmntData.value.p_idlocation = this.ligneLocation.r_i;
    this.reglmntData.value.p_date_creation = this.getDateJour();
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
          //this.notifications.sendMessage('Enregistrement effectué avec success','success');
          this.toastr.success('Succès', 'Enregistrement effectué avec success.');
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
    this.dateData.debut = a;//[...a.split('-')];
  }

  _getdatefin(){
    const a = this.locationData.value?.p_date_retour.split('T')[0];
    this.dateData.fin = a;//[...a.split('-')];

    let debut = moment(this.dateData.debut);
    let fin = moment(this.dateData.fin);
    
    this.nbreJrLocation = fin.diff(debut, 'days');
    this.totalLocation.mewTotal = this.totalLocation?.mntTotal * this.nbreJrLocation;
    this.remisepercent = 0;
    this.remisemnt = 0;
  }

  _getdatedebutModif(){
    const a = this.showLocationData.value.p_date_envoie.split('T')[0];
    this.dateData.debut = a;//[...a.split('-')];
  }
  _getdatefinModif(){
    const a = this.showLocationData.value?.p_date_retour.split('T')[0];
    this.dateData.fin = a;// [...a.split('-')];
   
    let d = (this.dateData.debut == undefined)? moment(this.dateEnvoie.split('T')[0].split('-')) : moment(this.dateData.debut);
    let c = moment(this.dateData.fin);

    this.nbreJrLocation = c.diff(d, 'days');
    this.totalLocationModif.mewTotal = this.totalLocationModif?.mntTotal * this.nbreJrLocation;
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

  addNewProduct(product){
   //this.modeAppel = 'modif';
    let newProduct: any =[], tabs: any = [];
    this.detailsLocationTab.splice(this.nbreLigne, this.detailsLocationTab.length-this.nbreLigne);

    product.map(item =>{
      return newProduct.push({
        r_produit: item.id,
        r_prix_location: item.r_prix_location,
        r_quantite: 0,
        r_sous_total: 0,
      }); 
   });
   tabs = [...this.detailsLocationTab,...newProduct]
   this.detailsLocationTab = [...tabs];
   
  }

  updateLocation(){
    let ta: any = [];
    //this.showLocationData.value.p_date_envoie = this.showLocationData.value.p_date_envoie.replace('T', ' ');
    //this.showLocationData.value.p_date_retour = this.showLocationData.value.p_date_retour.replace('T', ' ');
    this.showLocationData.value.p_idlocation = this.ligneLocation.r_i;

    
  //Renommage des clés json des détails
    this.detailsLocationTab.map(item =>{
       return ta.push({
        qte: item.r_quantite,
         idproduit: item.r_produit,
         total: item.r_sous_total,
         location: item.r_location,
         p_produit_manquant: 0,
        }); 
    });
     
    this.showLocationData.value.p_details = ta;
    this.showLocationData.value.p_majQte = this.produitsTabLoues;

    this.showLocationData.value.p_duree = this.nbreJrLocation;

    this.showLocationData.value.p_mnt_total = this.totalLocationModif?.mntTotal * this.nbreJrLocation;
    this.showLocationData.value.p_utilisateur = this.userData.r_i;
    console.log(this.showLocationData.value);

    this.location._update(this.showLocationData.value).subscribe(
      (data) => {

        if(data._status == 1){
          //this.notifications.sendMessage(data._result,'success');
          this.toastr.success('Succès', data._result);
          this.showLocationData.reset();
          this.modalService.dismissAll('close');
          this._search_location(this.searchData.value);
        }
        
      },
      (err) => console.log(err.stack))
  
  }

  //Afficher ou caher le contenu pour l'ajout des produits
  _addProdut() {

    let tabIds: number[] = [], obj: any = {};
    this.tarificationTabCiblees = [];
    
    //this.modeAppel = 'creation';
    //Récupération des id des produits faisant partis de la location
    this.detailsLocationTab.forEach((el)=>{
      tabIds.push(el.r_produit);
    });

   obj.p_idproduits = tabIds;
   //Récupération des trarification differents de la location
    this.tarifService._getTarificationsCiblees(obj).subscribe(
      (res: any = {})=>{
        this.tarificationTabCiblees = res._result;
      },
      (err) => {console.log(err.stack)}
    );
      
  }


  //PDF
  public export(data, dataClient): void {

    //this._listDetailLocationByidLocation(this.ligneLocation.r_i);

    const docDefinition = {


      header: {
        
        columns: [
          {
            image: 'data:image/jpeg;base64,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',
            width: 100,
            margin: [30, 15, 0, 0 ]
          },
          {
            text:[
              'Prestations en décoration, location de matériels pour cérémonies\n',
              '01 01 31 94 93 – 07 59 18 82 75 – 05 85 43 44 43',
            ],
            alignment: 'center',
            margin: [0, 10, 0, 0 ]
          },
        ],
        
      },

      footer: {
        text:[
          '01 01 31 94 93 –07 59 18 82 75 –05 85 43 44 43 | 31 BP 840 Abidjan 31\n',
          'RC N° CI-ABJ-2018-A-3897 CCN°1904880V N° SOCIAL : 368787',
        ],
        alignment: 'center',
        margin: [0, 0, 10, 0 ]
      },

      watermark: { text: 'Eden Décoration', color: 'black', opacity: 0.05, italics: false },
      content: [

        {
          columns: [
            [
              {
                text: (dataClient.r_status == 0)? 'Facture Proforma' : 'Facture N° : ' + dataClient.r_num,
                style:"momo"
              },
              {
                text: dataClient.created_at
              }
            ],
            // {
            //   text: (dataClient.r_status == 0)? 'Facture Proforma' : 'Facture N° : ' + dataClient.r_num,
            //   style:"momo"
            // }
          ],
          margin: [ 0, 30, 0, 0 ]
        },

        {
          columns: [
            [{
              text: 'Prestataire :',
              decoration: 'underline'
            },
             {
               text: "Eden Décoration",
              
           }
            ],
          ],
          style: 'eden'
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
        {text: 'Transport', style: 'subheader'},
    		{
    			style: 'transport',
          alignment: 'right',
    			table: {
            widths: [ 100, 100],
    				body: [
    					['Frais', dataClient?.r_frais_transport],
    					['Véhicule', this.ligneLocation?.r_vehicule + ' | ' +this.ligneLocation?.r_matricule],
    					['Destination', this.ligneLocation?.destination]
    				]
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
              text: 'Devise de l’opération est le Franc cfa (Fcfa).',
              style:"cfa"
            }]
          ],
          style: 'devise'
        }

      ],



      styles: {
        header: {
          fontSize: 13,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        transport:{
          alignment: 'right'
        },
        subheader: {
          fontSize: 12,
          bold: true,
          color: 'blue',
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        eden: {
          margin: [0, 10, 0, 0]
        },
        devise: {
          margin: [0, 10, 0, 0]
        },
        cfa:{
          margin: [0, 10, 0, 10]
        },
        footer: {
          margin: [0, 10, 10, 0]
        },
        momo:{
          fontSize: 13,
          bold: true,
          color: 'black',
          decoration:"underline",
        }
      }
    };

    pdfmake.createPdf(docDefinition).open();
  }

}
