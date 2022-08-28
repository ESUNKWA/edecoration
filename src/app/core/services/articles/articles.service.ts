import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  env = environment;
  headers = new HttpHeaders()
                .set('Content-Type', 'application/json');

  constructor(private http: HttpClient ) { }


  _create(data: any): Observable<any> {
    return this.http.post(`${this.env.backendServer}/produits_en_ventes`,data).pipe(catchError(this.error));
  }

  _list(){

    const token = sessionStorage.getItem('token');
    return this.http.get(`${this.env.backendServer}/produits_en_ventes`, { 'headers': this.headers });
  }

  _update(data: any, id: number): Observable<any>{
    return this.http.put(`${this.env.backendServer}/produits_en_ventes/${id}`, data).pipe(catchError(this.error));
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
