import { Injectable, Inject, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {AuthService} from './auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/do';
import { HttpResponse, HttpErrorResponse} from '@angular/common/http';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private router: Router, public injector: Injector, private authService: AuthService) { }

intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
  });
    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.authService.collectFailedRequest(request);
          this.router.navigate(['/login']);
        }
      }
    });
  }
}
