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
pdfmake.vfs = pdfFonts.pdfMake.vfs;

const fc = async (idlocation: any)=> {
  
}

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
modeAppel: any = 'création';
tarificationTab: any = [];
produitsTab: any = [];
viewTable: boolean = false;
  recapTab: any;
  totalLocation: any={};
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
  searchData: FormGroup;
  submit: boolean = false;

  cboDefaultValue: any;
  selectedVehicule: any;
  majStatusData: any = {};
  dateData: any = {};
  nbreJrLocation: any = 1;
  modeDate: number;
  btnValidation: any;
  desactiver: boolean = false;

  constructor(private notifications: NotifService, private user: UserService, private modalService: NgbModal, private tarifService: TarificationsService,
              private fb: FormBuilder, private communeService: CommunesService, private logistkService: LogistikService, private location: LocationService,
              private exportpdf: DataprintformatService) { }

  ngOnInit(): void {
    //this.cboDefaultValue,this.searchData.value.p_date.split('T')[0]
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

    this.userData = this.user._donnesUtilisateur()[0];
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

  _gestionLogistik(val: boolean): void {
    this.logistik = val;
  }

  //sélection quantité par produit
  _valueQte(val,i){
    this.totalLocation = {};
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

  }

  //Liste des communes
  _listCommunes(): void {
    this.communeService._getCommunes().subscribe(
      (data: any) => {
        this.CommunesTab = [...data._result];
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
    this.locationData.value.p_details = this.recapTab;
    this.locationData.value.p_mnt_total = this.totalLocation.mntTotal * this.nbreJrLocation;
    this.locationData.value.p_remise = parseInt(this.valremise, 10);
    this.locationData.value.p_mnt_total_remise = this.totalLocation.mewTotal;
    this.locationData.value.p_vehicule = this.locationData.value.p_vehicule?.value;

    this.locationData.value.p_commune_depart = this.selectedCityDapart?.value;
    this.locationData.value.p_commune_arrive = this.selectedCityarrive?.value;
    this.locationData.value.p_duree = this.nbreJrLocation;
    this.locationData.value.p_utilisateur = this.userData.r_i;
    this.locationData.value.p_signe = "-";

    this.locationData.value.p_date_envoie = this.locationData.value.p_date_envoie.replace('T', ' ');
    this.locationData.value.p_date_retour = this.locationData.value.p_date_retour.replace('T', ' ');

    this.location._create(this.locationData.value,1).subscribe(
      (data: any = {})=>{

        if( data._status == 1){
          this.notifications.sendMessage(data._result,'success');
          this.locationData.reset();
          this._listProduits();
        }
        this.nbreJrLocation = 0;
        this.remisemnt = 0;
        this.remisepercent = 0;
        this.remisenewmnt = 0;
        this.totalLocation = {};
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
    this.selectedCityDapart = 12;
    this.selectedVehicule = this.ligneLocation.r_logistik;

    this.logistik = (this.ligneLocation.r_frais_transport == 0)? false: true;

  
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
    this.interface = 'saisie';
    this.selectedCityDapart = '';
    this.selectedCityarrive = '';

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
        obj.idproduit = el.r_produit,
        obj.qte = el.r_quantite
        tab.push(obj);
    });
    this.majStatusData.p_details = tab;
    this.majStatusData.p_signe = "+";
   
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
        
      },
      (err) => {console.log(err.stack)}
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
