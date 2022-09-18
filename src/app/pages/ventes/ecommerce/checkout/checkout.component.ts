import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NotifService } from 'src/app/core/services/notif.service';
import { VenteService } from 'src/app/core/services/vente/vente.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})

/**
 * Ecommerce checkout component
 */
export class CheckoutComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  selectValue = [];
  stateValue = [];
  panierAchat: any = [];
  totalAchat: any;

  clientData: FormGroup

  dataSend: any = {};

  constructor( private activatedRoute: ActivatedRoute , private notifications: NotifService, private router: Router,
              private fb: FormBuilder, private venteService: VenteService) {
                this.clientData = this.fb.group({
                    r_nom: [],
                    r_email: [],
                    r_telephone: [],
                    r_decription: []
                });
              }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Vente' }, { label: 'Client', active: true }];
    this.panierAchat = JSON.parse(this.activatedRoute.snapshot.queryParamMap.get('panierAchat'));
    this.totalAchat = JSON.parse(this.activatedRoute.snapshot.queryParamMap.get('totalAchat'));

  }

  register(){
    this.clientData.value.r_utilisateur = 4;
    this.dataSend.p_details = this.panierAchat;
    this.dataSend.p_client = this.clientData.value;
    this.dataSend.p_vente = {r_mnt_total:this.totalAchat, r_creer_par:4};

    this.venteService._create(this.dataSend).subscribe(
      (data)=>{
        if( data._status == 1 ){
          this.notifications.sendMessage(data._message,'success');
          setTimeout(() => {
            location.reload();
          }, 500);
        }
        console.log(data);
      },
      (error)=>{
        console.log(error);

      }
    );

    this.notifications.sendMessage('Nous sommes toujours en cours de developpement','warnong');
  }

  navigateCart(){
    this.router.navigate(
                        ['/edeco/shop/cart'],
                        { queryParams: { panier: JSON.stringify(this.panierAchat), totalAchat: JSON.stringify(this.totalAchat?.value)},
                          skipLocationChange: true });
  }



}
