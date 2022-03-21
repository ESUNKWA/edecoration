import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  apiHost: any
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor( private http: HttpClient ) {
    this.apiHost = 'http://127.0.0.1:8000/api';
  }

  _create(data: any): Observable<any> {
    return this.http.post(`${this.apiHost}/categories`,data).pipe(catchError(this.error));
  }

  _getproduits(){
    return this.http.get(`${this.apiHost}/categories`);
  }

  _update(data: any, id: number): Observable<any>{
    return this.http.put(`${this.apiHost}/categories/${id}`, data).pipe(catchError(this.error));
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
