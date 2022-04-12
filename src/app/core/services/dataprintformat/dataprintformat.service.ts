import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataprintformatService {
  tabData:any = []

  constructor() { }

  printData(data: any[]) {
    this.tabData = [];
     data.forEach((el)=>{
          let array = [];
          for(let key in el){  
           if(el.hasOwnProperty(key)){  
             array.push(el[key]);
           } 
          } 
           this.tabData.push(array);
    });

    return this.tabData;
  }

}
