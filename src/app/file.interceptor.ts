import { Injectable } from '@angular/core';
import {
  HttpEvent, 
  HttpInterceptor, 
  HttpHandler, 
  HttpRequest,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoopBackAuth } from '../sdk';
import { CONFIG } from './main';

@Injectable()
export class FileInterceptor implements HttpInterceptor {
  private config: any = CONFIG;
  private baseUrl: string;
  private apiVersion: string;

  constructor(public lbAuth: LoopBackAuth) {
    this.baseUrl = this.config.BASE_URL;
    this.apiVersion = this.config.API_VERSION;
  }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    /**
     * Prevent to intercept others request
     */
    if (req.url.indexOf('Files/') === -1 && req.url.indexOf('Conversations/') === -1) {
      return next.handle(req);
    }

    console.log(req);
    
    const url = `${this.baseUrl}/${this.apiVersion}/${req.url}`;
    const token = this.lbAuth.getToken();
    const headers = new HttpHeaders({
      Authorization: token.id
    });
    const newReq = req.clone({
      headers: headers,
      url: url
    });

    return next.handle(newReq);
  }
}