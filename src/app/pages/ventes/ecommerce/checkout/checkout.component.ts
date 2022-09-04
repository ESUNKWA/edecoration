import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NotifService } from 'src/app/core/services/notif.service';

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

  constructor( private activatedRoute: ActivatedRoute , private notifications: NotifService) { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Vente' }, { label: 'Client', active: true }];
    this.panierAchat = JSON.parse(this.activatedRoute.snapshot.queryParamMap.get('panierAchat'));
    this.totalAchat = JSON.parse(this.activatedRoute.snapshot.queryParamMap.get('totalAchat'));

  }

  register(){
    this.notifications.sendMessage('Nous sommes toujours en cours de developpement','warnong');
  }



}
