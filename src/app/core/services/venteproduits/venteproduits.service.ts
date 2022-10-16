import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VenteproduitsService {
  env = environment;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  _listventes(datedebut, datefin){
    return this.http.get(`${this.env.backendServer}/ventes_par_periode/${datedebut}/${datefin}`);
  }

  _details_ventes(idvente){
    return this.http.get(`${this.env.backendServer}/details_ventes/${idvente}`);
  }

   // Handle Errors
   error(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
