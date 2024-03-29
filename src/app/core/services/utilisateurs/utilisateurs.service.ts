import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from "../../../../../src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UtilisateursService {

  env = environment;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  _create(data: any): Observable<any> {
    return this.http.post(`${this.env.backendServer}/utilisateurs`,data).pipe(catchError(this.error));
  }

  _list(){
    return this.http.get(`${this.env.backendServer}/utilisateurs`);
  }


  _createPersonnel(data: any): Observable<any> {
    return this.http.post(`${this.env.backendServer}/personnel`,data).pipe(catchError(this.error));
  }

  _listPersonnel(){
    return this.http.get(`${this.env.backendServer}/personnel`);
  }
  _listPersonnelNotUser(){
    return this.http.get(`${this.env.backendServer}/personneltNotUser`);
  }

  // Handle Errors
  error(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => {
      return errorMessage;
    });
  }

}
