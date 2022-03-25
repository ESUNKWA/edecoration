import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../../../../src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AchatproduitsService {
  env = environment;
  apiHost: any
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) {
   }

   _getAchatsProduits(){
    return this.http.get(`${this.env.backendServer}/achatproduits`);
  }
}
