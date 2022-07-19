import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TestInterceptorInterceptor implements HttpInterceptor {
token: any;
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    this.token = sessionStorage.getItem('token');

    if(this.token){

      const cloneRequest = request.clone({
        //params: new HttpParams().set('token', this.token)
        setHeaders: { Authorization: `Bearer ${JSON.parse(this.token)}` },
      });

      return next.handle(cloneRequest);
  
    }else{

      return next.handle(request);
    }
    
  }
}
