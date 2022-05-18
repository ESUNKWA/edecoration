import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommunesService } from 'src/app/core/services/communes/communes.service';
import { FonctionService } from 'src/app/core/services/fonction/fonction.service';
import { NotifService } from 'src/app/core/services/notif.service';
import { UserService } from 'src/app/core/services/usersinfos/user.service';
import { UtilisateursService } from 'src/app/core/services/utilisateurs/utilisateurs.service';
import { Project } from '../projects/project.model';
import { projectData } from '../projects/projectdata';

@Component({
  selector: 'app-personnel',
  templateUrl: './personnel.component.html',
  styleUrls: ['./personnel.component.scss']
})
export class PersonnelComponent implements OnInit {
// bread crumb items
breadCrumbItems: Array<{}>;
personnelList: Array<{}>;
modeAppel: string;
modalTitle: string;

personnelData: FormGroup;
CommunesTab: any = [];
fonctionsTab: any = [];
datentree: any = [];
fonctionid: any;
quatierid: any;
viewTable: boolean = false;
submitted: boolean = false;
  utilisateur: any;
  detailsPersonnel: any = {};

  constructor( private personnelService: UtilisateursService,private modalService: NgbModal,
                private fb: FormBuilder, private communeService: CommunesService, private fonctionServices: FonctionService, 
                private userServices: UserService, private notifications: NotifService ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Eden décoration' }, { label: 'Personnel entreprise', active: true }];
    this.utilisateur = this.userServices._donnesUtilisateur()[0];
    this.personnelData = this.fb.group({
      p_civilite: [0],
      p_nom: ['', [Validators.required]],
      p_prenoms: ['', [Validators.required]],
      p_contact: ['', [Validators.required]],
      p_date_entree: [''],
      p_quatier: [''],
      p_fonction: ['', [Validators.required]],
      p_description: [''],
      p_utilisateur: ['',],
      p_email: [''],
    })

    
    this._listCommunes();
    this._listFonctions();
    this._listPersonnel();
  }

  get f(){
    return this.personnelData.controls;
  }

  _listPersonnel(){
    this.personnelService._listPersonnel().subscribe(
      (data: any = {}) => {
        this.personnelList = [...data._result];
        setTimeout(() => {
          this.viewTable = true;
        }, 200);
      }
    );
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
   //Liste des fonctions
   _listFonctions(): void {
    this.fonctionServices._list().subscribe(
      (data: any) => {
        this.fonctionsTab = [...data._result];
        
      },
      (err) => {console.log(err.stack);
      }
    );
  }

  _getdatedebut(){
    const a = this.personnelData.value.p_date_entree?.split('T')[0];
    this.datentree = [...a.split('T')]; 
    
  }

  _register(){

    this.personnelData.value.p_date_entree = this.datentree[0];
    this.personnelData.value.p_fonction = this.fonctionid;
    this.personnelData.value.p_quatier = this.quatierid;
    this.personnelData.value.p_utilisateur = this.utilisateur.r_i;;

    this.submitted = true;

    if( this.personnelData.invalid ){
      return;
    }


    this.personnelService._createPersonnel(this.personnelData.value).subscribe(
      (data: any ) => {
        if( data?._status == 1 ){
          this.personnelData.reset();
          this.notifications.sendMessage(data._result,'success');
          this._listPersonnel();
        }else{
          this.notifications.sendMessage(Object.values(data)[0][0],'error');
        }
        
      }
    )
    
  }

  _afficheModal(largeDataModal: any, modeAppel, data){
    //this.modeAppel = 'creation';
    

    switch (this.modeAppel) {
      case 'creation':
        this.modalTitle = 'Saisie un nouveau employé';
        break;

      default:
        this.modalTitle = `Modification de l\'employé [ ${data.r_nom} ${data.r_prenoms} ]`;
        this.detailsPersonnel = data;
        this.quatierid = this.detailsPersonnel.r_quartier;
        break;
    }

    //this.categoriesData.reset();
    this.largeModal(largeDataModal);
  }

  //Appel de la modal
  largeModal(exlargeModal: any) {
    this.modalService.open(exlargeModal, { size: 'lg', centered: true });

  }

}
