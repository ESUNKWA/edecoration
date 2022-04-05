import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'; 

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  items: any[];
  value: any[];
  tab: any[] = [
    {
      entete:'nom',
      col: 'Nom'
    },
    {
      entete:'prenoms',
      col: 'Prénoms'
    },
    {
      entete:'contact',
      col: 'Contact'
    }
  ]; //

  a = moment([2022,4,7]);
  b = moment([2022,4,1]);

  constructor() { }

  ngOnInit(): void {
    this.items = [...this.tab];
    this.value = [
      {
        id:1,
        nom: "DEKI",
        prenoms:"Momo",
        contact:"0759947136",
        status:"Inactif"
      },
      {
        id:2,
        nom: "Kone",
        prenoms:"Isaa",
        contact:"434343",
        status:"Actif"
      },{
        id:3,
        nom: "Kone",
        prenoms:"Isaa",
        contact:"434343",
        status:"Actif"
      },{
        id:4,
        nom: "Kone",
        prenoms:"Isaa",
        contact:"434343",
        status:"Actif"
      }
    ];
    let now1 = moment("2022-04-04T16:52", "YYYYMMDD");

     // 1
    
    console.log(this.a.diff(this.b, 'days'));
    
  }

}
