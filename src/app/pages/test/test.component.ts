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

  fin = moment("2022-5-1");
  debut = moment("2022-4-29");

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
    console.log(this.fin.diff(this.debut, 'days'));

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

        {
          columns: [
            [
              {
                text: 'Facture N° : ' + "this.detailsFacture.r_num",

              },
              {
                text: "this.detailsFacture.created_at"
              }
            ]
          ],
          style: 'facture'
        },

        {
          columns: [
            [{
              text: 'Boutique/Commerce :',
              decoration: 'underline'
            },
            {
              text: "this.infosPatenaire[0].r_nom"
            },
            {
              text: "this.infosPatenaire[0].r_quartier"
            },
            {
              text:"this.infosPatenaire[0].email || '',"
            },
            {
              text: "this.infosPatenaire[0].phone || ''",
            }
            ],
          ],

        },
        {
          columns: [
            [{
              text: 'A : Client/ Destinataire :',
              decoration: 'underline'
            },
              {
                text: "this.detailsFacture.r_nom + ' ' + this.detailsFacture.r_prenoms",
                style: 'nomclient'
              },
              {
                text: "this.detailsFacture.r_phone || 'Pas de numéro'",
                style: 'phoneclient'
              },
              {
                text: 'Abidjan',
                style: 'ville'
              }
            ]
          ],
          alignment: 'right'
        },
        {
          text: 'Intitulé: Produits facturés',
          style: 'header'
        },


        {
          style: "tableExample",
          table: {
            headerRows: 1,
            widths: [ '*', '*', '*'],
            body: [
              ["Column 1", "Column 2", "Column 3"],
              ["One value goes here", "Another one here", "OK?"],
              ["One value goes here", "Another one here", "OK?"],
              ["One value goes here", "Another one here", "OK?"]
            ]
          }
        },

        {
          columns: [
            [{
              text: 'En votre aimable règlement'
            },
            {
              text: 'Cordialement'
            },
            {
              text: 'Devise de l’opération est le Franc cfa (Fcfa).'
            }]
          ],
          style: 'note'
        },
        {
          columns: [
            {
              text: "his.infosPatenaire[0].r_quartier + ' '+ this.infosPatenaire[0].r_situation_geo"
            }
          ],
          style: 'piedpage'
        },

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

    pdfmake.createPdf(docDefinition).open();
  }

}
