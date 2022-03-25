import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogistikService } from 'src/app/core/services/logistik/logistik.service';
import { NotifService } from 'src/app/core/services/notif.service';
import { UserService } from 'src/app/core/services/usersinfos/user.service';

@Component({
  selector: 'app-logistik',
  templateUrl: './logistik.component.html',
  styleUrls: ['./logistik.component.scss']
})
export class LogistikComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  viewTable: boolean = false;
  searChIn: any;
  userData: any;
  logistkTab: any = [];
  modalTitle: any = '';
modeAppel: any = 'création';
logistikData: FormGroup;
ligneLogistik: any = {};

  constructor(private user: UserService, private logistkService: LogistikService, private modalService: NgbModal,
              private fb: FormBuilder, private notifications: NotifService) { 
                this.logistikData = this.fb.group({
                  r_matricule: [],
                  p_description: [],
                  p_vehicule: []
                });
              }

  ngOnInit(): void {
    this.userData = this.user._donnesUtilisateur()[0];
    this.breadCrumbItems = [{ label: 'Eden décoration' }, { label: 'Catégories de produits', active: true }];
    this._listLogistik();
  }

  _saisieLogistik(largeDataModal: any){
    this.modeAppel = 'creation';
    this.modalTitle = 'Saisie un nouveau véhicule';
    this.logistikData.reset()
    this.largeModal(largeDataModal);
  }

  _action(logistik, largeDataModal){
    this.ligneLogistik = {...logistik};

    this.modeAppel = 'modif';
    this.modalTitle = `Modification du véhicule immatriculé [ ${this.ligneLogistik.r_matricule} ]`;


    this.largeModal(largeDataModal);
  }

  _listLogistik(): void {
    this.logistkService._getlogistik().subscribe(
      (data: any) => {
        this.logistkTab = [...data._result];
        setTimeout(() => {
          this.viewTable = true;
        }, 500);
      },
      (err) => {console.log(err.stack);
      }
    );
  }

  _register(): void {

    this.logistikData.value.p_utilisateur = parseInt(this.userData.r_i, 10);

    switch (this.modeAppel) {
      case 'creation':
          this.logistkService._create(this.logistikData.value).subscribe(
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
              this.logistikData.reset();

              this._listLogistik();
            },
            (err: any) => {
              console.log(err);
            }
          );
        break;

      case 'modif':
        this.logistkService._update(this.logistikData.value, this.ligneLogistik.r_i).subscribe(
          (dataServer: any) => {
            this.logistikData.reset();
            this.notifications.sendMessage(`${dataServer._result}`,'success');
            this._listLogistik();
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
