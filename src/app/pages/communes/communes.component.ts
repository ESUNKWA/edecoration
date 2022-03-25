import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommunesService } from 'src/app/core/services/communes/communes.service';
import { NotifService } from 'src/app/core/services/notif.service';
import { UserService } from 'src/app/core/services/usersinfos/user.service';

@Component({
  selector: 'app-communes',
  templateUrl: './communes.component.html',
  styleUrls: ['./communes.component.scss']
})
export class CommunesComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  viewTable: boolean = false;
  searChIn: any;
  userData: any;
  CommunesTab: any = [];
  modeAppel: any = 'création';
  modalTitle: any = '';
  ligneCommune: any = {};
  communesData: FormGroup

  constructor(private modalService: NgbModal, private communeService: CommunesService, private fb: FormBuilder, private notifications: NotifService,
              private user: UserService) { }

  ngOnInit(): void {
    this.userData = this.user._donnesUtilisateur()[0];
    this.breadCrumbItems = [{ label: 'Eden décoration' }, { label: 'Communes', active: true }];
    this.communesData = this.fb.group({
      r_libelle: [],
      p_description: []
    });
    this._listCommunes();
  }

  _saisieCommune(largeDataModal){
    this.modeAppel = 'creation';
    this.modalTitle = 'Saisie une nouvelle commune';
    this.largeModal(largeDataModal);
  }

  _listCommunes(): void {
    this.communeService._getCommunes().subscribe(
      (data: any) => {
        this.CommunesTab = [...data._result];
        
        setTimeout(() => {
          this.viewTable = true;
        }, 500);
      },
      (err) => {console.log(err.stack);
      }
    );
  }

  //Appel de la modal
  largeModal(exlargeModal: any) {
    this.modalService.open(exlargeModal, { size: 'lg', centered: true });
  }

  _register(): void {

    this.communesData.value.p_utilisateur = parseInt(this.userData.r_i, 10);

    switch (this.modeAppel) {
      case 'creation':
          this.communeService._create(this.communesData.value).subscribe(
            (dataServer: any) => {
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
              this.communesData.reset();

              this._listCommunes();
            },
            (err: any) => {
              console.log(err);
            }
          );
        break;

      case 'modif':
        this.communeService._update(this.communesData.value, this.ligneCommune.r_i).subscribe(
          (dataServer: any) => {
            this.communesData.reset();
            this.notifications.sendMessage(`${dataServer._result}`,'success');
            this._listCommunes();
          },
          (err: any) => {
            console.log(err);
          }
        );
      default:
        break;
    }
  }

  _action(commune, largeDataModal){
    this.ligneCommune = {};
    this.modeAppel = 'modif';
    this.ligneCommune = {...commune};
    this.modalTitle = `Modification de la commune [ ${this.ligneCommune.r_libelle} ]`;
    this.largeModal(largeDataModal);
  }

}
