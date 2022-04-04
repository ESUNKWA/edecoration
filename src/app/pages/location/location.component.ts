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
  locationtab: any[];
  interface: any = 'liste';
  ligneLocation: any = {};
  detailsLocationTab: any[];
  dateEnvoie: any;
  dateretour: any;
  selectDemandeStat: any;

  demandeStat: any = [
    {
      value: 0,
      label: 'Demande de locations en cours'
    },
    {
      value: 1,
      label: 'Demandes de locations validés'
    },
    {
      value: 2,
      label: 'Demande de locations annulée'
    }
  ];

  constructor(private notifications: NotifService, private user: UserService, private modalService: NgbModal, private tarifService: TarificationsService,
              private fb: FormBuilder, private communeService: CommunesService, private logistkService: LogistikService, private location: LocationService,
              ) { }

  ngOnInit(): void {

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

    this.userData = this.user._donnesUtilisateur()[0];
    this.breadCrumbItems = [{ label: 'Eden décoration' }, { label: 'Liste des locations', active: true }];

    this.totalLocation.qteproduits = 0;
    this.totalLocation.mntTotal = 0;
    this.totalLocation.mewTotal = 0;

    this._listProduits();
    this._listCommunes();
    this._listLogistik();

    //this.selectedCityDapart = this.CommunesTab[8];
  }

  get formvalidate() { return this.locationData.controls;}

  //Calcul de la remise de la remise
  _calculateRemise(val, typeremise){
      switch (typeremise) {
        case 'percent':
          console.log(this.remisepercent)
          this.remisemnt = 0;
          this.remisenewmnt = 0;
          const valeur1 = parseInt(val, 10) * (1/100);
          this.totalLocation.mewTotal = this.totalLocation.mntTotal - (this.totalLocation.mntTotal * valeur1);
          break;

        case 'mntfixe':
          this.remisepercent = 0;
          this.remisenewmnt = 0;
          const valeur2 = parseInt(val, 10);
          this.totalLocation.mewTotal = this.totalLocation.mntTotal - valeur2;
          break;

        case 'newmnt':
          this.remisepercent = 0;
          this.remisemnt = 0;
          const valeur3 = parseInt(val, 10);
          this.totalLocation.mewTotal = valeur3;
          this.valremise = this.totalLocation.mntTotal - valeur2;
          break;
      }
      this.valremise = this.remisepercent || this.remisemnt || this.remisenewmnt;
      console.log(this.valremise)

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
    this.locationData.value.p_mnt_total = this.totalLocation.mntTotal;
    this.locationData.value.p_remise = parseInt(this.valremise, 10);
    this.locationData.value.p_mnt_total_remise = this.totalLocation.mewTotal;
    this.locationData.value.p_vehicule = this.locationData.value.p_vehicule?.value;


    this.locationData.value.p_commune_depart = this.selectedCityDapart?.value;
    this.locationData.value.p_commune_arrive = this.selectedCityarrive?.value;
    this.locationData.value.p_utilisateur = this.userData.r_i;

    this.locationData.value.p_date_envoie = this.locationData.value.p_date_envoie.replace('T', ' ');
    this.locationData.value.p_date_retour = this.locationData.value.p_date_retour.replace('T', ' ');

    this.location._create(this.locationData.value,1).subscribe(
      (data: any = {})=>{

        if( data._status == 1){
          this.notifications.sendMessage(data._result,'success');
          this.locationData.reset();

        }

      },
      (err)=>{console.log(err);
      }
    )

    console.log(this.locationData.value);

  }

  _actionLocation(largeDataModal,ligneLocation){

    this.ligneLocation = {...ligneLocation};
    this.modalTitle = `Demande de location N [ ${this.ligneLocation.r_num} ]`;
    this.dateEnvoie = this.ligneLocation.r_date_envoie.replace(' ', 'T');
    this.dateretour = this.ligneLocation.r_date_retour.replace(' ', 'T');

    this.logistik = (this.ligneLocation.r_frais_transport == 0)? false: true;

    this._listDetailLocationByidLocation(this.ligneLocation.r_i);
    this._produits();

    this.largeModal(largeDataModal)
  }

  _liste_location() {
    this.location._getLocation(this.selectDemandeStat.value).subscribe(
      (res: any)=>{
        this.locationtab = [...res._result];
        setTimeout(() => {
          this.viewTable = true;
        }, 500);
      }
    )
  }
  _listProduits(): void {
    this.tarifService._getTarifications().subscribe(
      (data: any) => {
        this.tarificationTab = [...data._result];

        setTimeout(() => {
          this.viewTable = true;
        }, 500);
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

  _listDetailLocationByidLocation(idlocation: number): void {
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

  _saisie_location(largeDataModal){
    this.interface = 'saisie';
    //this.largeModal(largeDataModal);
  }
  _affiche_location(){
    this.interface = 'liste';
    this._liste_location();
  }

  //Appel de la modal
  largeModal(exlargeModal: any) {
    this.modalService.open(exlargeModal, { size: 'xl', centered: true });

  }

}
