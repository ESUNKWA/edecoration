import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifService } from 'src/app/core/services/notif.service';
import { ProfilService } from 'src/app/core/services/profil/profil.service';
import { UserService } from 'src/app/core/services/usersinfos/user.service';
import { UtilisateursService } from 'src/app/core/services/utilisateurs/utilisateurs.service';
import { userGridData } from '../contacts/usergrid/data';
import { Usergrid } from '../contacts/usergrid/usergrid.model';

@Component({
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.scss']
})
export class UtilisateursComponent implements OnInit {
 // bread crumb items
 breadCrumbItems: Array<{}>;

 userGridData: Usergrid[];
  selected: any;
  userData: FormGroup;
  submitted = false;
  items: FormArray;
  // Select2 Dropdown

  usersList: any[] = [];
  personnelList: any = [];
  contact: any;
  idemploye: any;
  profilList: any[] = [];
  selectedprofil: any;
  viewTable: boolean = false;
  utilisateur: any;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
    private utilisateurService: UtilisateursService, private notifications: NotifService, 
    private profilServices: ProfilService, private userServices: UserService,) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Eden décoration' }, { label: 'Liste des utilisateurs', active: true }];
    this.utilisateur = this.userServices._donnesUtilisateur()[0];
    this.userData = this.formBuilder.group({
      p_personnel: ['', [Validators.required]],
      p_profil: ['', [Validators.required]],
      password: ['', [Validators.required]],
      password_confirmation: ['', [Validators.required]],
    });

    this._listPersonnelNotUser();
    this._listutilisateur();
    this._listprofils();
    /**
     * fetches data
     */
    this._fetchData();
  }

  get form() {
    return this.userData.controls;
  }

  openModal(content: any) {
    this.modalService.open(content);
  }

  private _fetchData() {
    this.userGridData = userGridData;
  }

  _getContact(employer){
    
    this.contact = employer.contact;
    this.idemploye = employer.value;
    
  }


  saveUser() {
    
    this.submitted = true
    if (this.userData.invalid) {
      return;
    }
    this.userData.value.r_login = this.contact;
    this.userData.value.p_personnel = this.idemploye;
    this.userData.value.p_profil = this.selectedprofil;
    this.userData.value.p_utilisateur = this.utilisateur.r_i;

    this.utilisateurService._create(this.userData.value).subscribe(
      (data: any= {})=> {
        if(data._status == 1){
          this.userData.reset();
          this.notifications.sendMessage(data._result,'success');
          this._listutilisateur();
          this._listPersonnelNotUser();
        }else{
          this.notifications.sendMessage(Object.values(data)[0][0],'error');
        }
      },
      (err: any)=> {console.log(err.stack);
      }
    )
    
  }

  _listprofils(){
    this.profilServices._list().subscribe(
      (data: any = {}) => {
        this.profilList = [...data._result];
        
      },
      (err) => {console.log(err.stack)})
  }

  _listutilisateur(){
    this.utilisateurService._list().subscribe(
      (data: any = {}) => {
        this.usersList = [...data._result];
        setTimeout(() => {
          this.viewTable = true;
        }, 200);
      },
      (err) => {console.log(err.stack)})
  }

  _listPersonnelNotUser(){
    this.utilisateurService._listPersonnelNotUser().subscribe(
      (data: any = {}) => {
        data._result.forEach((item: any) => {
          let obj: any = {};
          obj.value = item.r_i;
          obj.label = item.r_nom + ' ' + item.r_prenoms;
          obj.contact = parseInt(item.r_contact,10);
          this.personnelList.push(obj);
        });
        
      }
    );
  }
}
