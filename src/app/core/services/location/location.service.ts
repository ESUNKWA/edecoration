import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  env = environment;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  _create(data: any, mode): Observable<any> {
    return this.http.post(`${this.env.backendServer}/location/${mode}`, data).pipe(catchError(this.error));
  }

  _getLocations(status, p_date, modeDate){
    return this.http.get(`${this.env.backendServer}/location/${status}/${p_date}/${modeDate}`);
  }

  _getLocationByCrteres(data: any): Observable<any> {
    return this.http.post(`${this.env.backendServer}/location`, data).pipe(catchError(this.error));
  }

  _majStatusLocation(data: any): Observable<any>{
    return this.http.post(`${this.env.backendServer}/updatestatlocation`, data).pipe(catchError(this.error));
  }

  _getDetailLocationByid(idlocation: number): Observable<any> {
    return this.http.get(`${this.env.backendServer}/detailslocation/${idlocation}`);
  }

  _update(data: any): Observable<any>{
    return this.http.post(`${this.env.backendServer}/updatelocation`, data).pipe(catchError(this.error));
  }

  _add_reglmnt_paiemnt(data: any): Observable<any> {
    return this.http.post(`${this.env.backendServer}/paymentpartiel`, data).pipe(catchError(this.error));
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
