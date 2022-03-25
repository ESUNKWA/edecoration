import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from "../../../../../src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  env = environment;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor( private http: HttpClient ) {
  }

  _create(data: any): Observable<any> {
    return this.http.post(`${this.env.backendServer}/produits`,data).pipe(catchError(this.error));
  }

  _getproduits(){
    return this.http.get(`${this.env.backendServer}/produits`);
  }

  _update(data: any, idproduit: number): Observable<any>{
    return this.http.put(`${this.env.backendServer}/produits/${idproduit}`, data).pipe(catchError(this.error));
  }


  _addTrarification(data: any): Observable<any> {
    return this.http.post(`${this.env.backendServer}/majstock`,data).pipe(catchError(this.error));
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
