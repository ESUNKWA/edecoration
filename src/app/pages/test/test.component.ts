import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'; 

import pdfmake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfmake.vfs = pdfFonts.pdfMake.vfs;

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

  public export(): void {

    const docDefinition = {


      footer: {
        columns: [
          'Left part',
          { text: 'Right part', alignment: 'right' }
        ]
      },
      
    
      content: [
        { text: "Tables", style: "header" },
        {text:"Official documentation is in progress, this document is just a glimpse of what is possible with pdfmake and its layout engine."},
        {
          text:
            "A simple table (no headers, no width specified, no spans, no styling)",
          style: "subheader"
        },
        "The following table has nothing more than a body array",
        {
          style: "tableExample",
          table: {
            body: [
              ["Column 1", "Column 2", "Column 3"],
              ["One value goes here", "Another one here", "OK?"]
            ]
          }
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

    pdfmake.createPdf(docDefinition).download("test.pdf");
  }

}
