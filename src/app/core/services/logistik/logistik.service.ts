import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from "../../../../../src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LogistikService {
  env = environment;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) { }

  
  _create(data: any): Observable<any> {
    return this.http.post(`${this.env.backendServer}/logistik`,data).pipe(catchError(this.error));
  }

  _getlogistik(){
    return this.http.get(`${this.env.backendServer}/logistik`);
  }

  _update(data: any, id: number): Observable<any>{
    return this.http.put(`${this.env.backendServer}/logistik/${id}`, data).pipe(catchError(this.error));
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
