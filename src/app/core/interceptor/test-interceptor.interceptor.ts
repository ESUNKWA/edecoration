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

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = sessionStorage.getItem('token');

    if(token){
      const cloneRequest = request.clone({
        //params: new HttpParams().set('token', token)
        setHeaders: { authorization: 'Bearer' + token },
      });
    }
    
    return next.handle(request);
  }
}
