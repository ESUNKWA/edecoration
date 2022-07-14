import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { earningLineChart, salesAnalyticsDonutChart, ChatData } from './data';
import { ChartType, ChatMessage } from './saas.model';
import { ConfigService } from '../../../core/services/config.service';
import { DashService } from 'src/app/core/services/dash/dash.service';

import * as moment from 'moment';

//Chart---------------------------------------------------------//

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexResponsive,

} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

export type ChartOptionsPie = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-saas',
  templateUrl: './saas.component.html',
  styleUrls: ['./saas.component.scss']
})
/**
 * Saas-dashboard component
 */
export class SaasComponent implements OnInit {

  @ViewChild('scrollRef') scrollRef;
//----------------------------------------------------Chart--------------------------------------------//
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild("chartPie") chartPie: ChartComponent;

  public chartOptionsPie: Partial<ChartOptionsPie>;
//----------------------------------------------------Chart--------------------------------------------//
  // bread crumb items
  breadCrumbItems: Array<{}>;

  earningLineChart: ChartType;
  salesAnalyticsDonutChart: ChartType;
  ChatData: ChatMessage[];

  sassEarning: Array<Object>;
  sassTopSelling: Array<Object>;

  formData: FormGroup;

  // Form submit
  chatSubmit: boolean;
  dashOne: any = {};
  dashTwo: any = [];
  StatParProduits: any = [];

  tab: any = [];
  totalAvance: number = 0;

  TabProdLoue:any = [];
  tabMntLoueProd:any = [];
  tabVentMensuel: any = [];
  tabMois: any = [];

  constructor(public formBuilder: FormBuilder, private configService: ConfigService, private dashServices: DashService,) {

   }

  /**
   * Returns form
   */
  get form() {
    return this.formData.controls;
  }

  async ngOnInit() {
    let paymntEchTab:any = [], ventMensuel: any = [];
    this.breadCrumbItems = [{ label: 'Eden décoration' }, { label: 'Tableau de bords', active: true }];

    let data: any =await this.dashServices._dashbord().toPromise();
    

   /*  console.log(data);
    

    ventMensuel = data[data.length - 1];

      this.dashOne = {...data[0][0]};

      this.StatParProduits = [...data[2]];

          data[3].forEach((item) => {
          paymntEchTab.push(JSON.parse(item.r_paiement_echell));
        }); */

        this.tab = paymntEchTab.flat();
        if (this.tab.length >= 1) {

          this.totalAvance =this.tab?.reduce(function (acc, obj) {
            ( obj?.p_date_creation == moment().format().split('T')[0])? obj?.p_mntverse : obj.p_mntverse = 0;
              return acc + obj.p_mntverse;
            }, 0
          );

        }


      this.StatParProduits.forEach((item)=>{
        this.TabProdLoue.push(item.produit);
        this.tabMntLoueProd.push(item.total);
      });

      ventMensuel.forEach((item)=>{
        this.tabVentMensuel.push(item.total);
        switch(item.mois){
            case 1:
            this.tabMois.push('Janvier');
              break;
            case 2:
              this.tabMois.push('Février');
              break;
            case 3:
                this.tabMois.push('Mars');
              break;
            case 4:
            this.tabMois.push('Avril');
              break;
            case 5:
            this.tabMois.push('Mai');
              break;
            case 6:
            this.tabMois.push('Juin');
              break;
            case 7:
            this.tabMois.push('Juillet');
              break;
            case 8:
            this.tabMois.push('Août');
              break;
            case 9:
            this.tabMois.push('Septembre');
              break;
            case 10:
            this.tabMois.push('Octobre');
              break;
            case 11:
            this.tabMois.push('Novembre');
              break;
            case 12:
            this.tabMois.push('Décembre');
              break;

        }

      });

    //----------------------------------------------------Chart--------------------------------------------//
    this.chartOptions = {
      series: [
        {
          name: "Vente annuelle par mois",
          data: this.tabVentMensuel
        }
      ],
      chart: {
        height: 350,
        type: "area",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: "Statistique annuelle des ventes",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: this.tabMois
      }
    };

    this.chartOptionsPie = {
      series: this.tabMntLoueProd,
      chart: {
        width: 600,
        type: "pie"
      },
      title: {
        text: "Statistique mensuelle par produit",
        align: "left"
      },
      labels: this.TabProdLoue,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 400
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
    //----------------------------------------------------Chart--------------------------------------------//

    // await this.dashServices._dashbord().subscribe(
    //   (data) => {
    //     this.dashOne = {...data[0][0]};
    //     this.StatParProduits = [...data[2]];

    //     this.StatParProduits.forEach((item)=>{
    //     this.TabProdLoue.push(item.produit);
    //     this.tabMntLoueProd.push(item.total);
    //   });

    //   console.log(this.TabProdLoue);

    //     data[3].forEach((item) => {
    //       paymntEchTab.push(JSON.parse(item.r_paiement_echell));
    //     });

    //     this.tab = paymntEchTab.flat();
    //     if (this.tab.length >= 1) {

    //       this.totalAvance =this.tab?.reduce(function (acc, obj) {
    //         ( obj.p_date_creation == moment().format().split('T')[0])? obj.p_mntverse : obj.p_mntverse = 0;
    //           return acc + obj.p_mntverse;
    //         }, 0
    //       );

    //     }
    //   },
    //   (err) => {console.log(err.stack)})


    this.formData = this.formBuilder.group({
      message: ['', [Validators.required]],
    });

    this.configService.getConfig().subscribe(response => {
      this.sassEarning = response.sassEarning;
      this.sassTopSelling = response.sassTopSelling;

    });
  }

  /**
   * Save the message in chat
   */


}
