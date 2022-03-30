import { Component, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
viewTable: boolean = false;
  recapTab: any;
  totalLocation: any={};
  selectValue: any[];
  logistik: boolean;
  selectedCity: any;
  remisepercent: any;
  remisemnt: any;
  remisenewmnt: any;

  locationData: FormGroup;

  constructor(private notifications: NotifService, private user: UserService, private modalService: NgbModal, private tarifService: TarificationsService,
              private fb: FormBuilder) { }

  ngOnInit(): void {

    this.locationData = this.fb.group({
      p_details: [],
      p_nom: [],
      p_prenoms: [],
      p_telephone: [],
      p_email: [],
      p_description: [],
      p_date_envoie: [],
      p_date_retour: [],
      p_commune_depart: [],
      p_commune_arrive: [],
      p_vehicule: [],
      p_frais: [],
    });

    this.userData = this.user._donnesUtilisateur()[0];
    this.breadCrumbItems = [{ label: 'Eden décoration' }, { label: 'Liste des locations', active: true }];
    this.totalLocation.qteproduits = 0;
    this.totalLocation.mntTotal = 0;
    this.totalLocation.mewTotal = 0;
    
    //this.selectValue = ['Alaska', 'Hawaii', 'California', 'Nevada', 'Oregon', 'Washington', 'Arizona', 'Colorado', 'Idaho', 'Montana', 'Nebraska', 'New Mexico', 'North Dakota', 'Utah', 'Wyoming', 'Alabama', 'Arkansas', 'Illinois', 'Iowa'];
    this.selectValue = [
      { value: 1, label: 'Abobo' },
        { value: 2, label: 'Koumassi' },
        { value: 3, label: 'Marcory'},
        { value: 4, label: 'Yopougon'}
    ];
    this.selectedCity = this.selectValue[3];

    this._listProduits();
  }

  //Calcul de la remise de la remise
  _calculateRemise(val, typeremise){
      switch (typeremise) {
        case 'percent':
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
          break;
      }
  }

  _test(a){
    console.log(a);
    
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
    console.log(this.locationData.value);
    
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

  _saisie_location(largeDataModal){
    this.largeModal(largeDataModal);
  }

  //Appel de la modal
  largeModal(exlargeModal: any) {
    this.modalService.open(exlargeModal, { size: 'xl', centered: true });

  }

}
