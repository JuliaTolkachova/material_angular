import { Injectable, Inject, Injector } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {catchError, map, tap} from 'rxjs/operators';
import 'rxjs/add/operator/map';
import {User} from './user';
import {MessageService} from './message.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { tokenNotExpired } from 'angular2-jwt';
import * as jwt_decode from 'jwt-decode';
import { Router, ActivatedRoute } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class AuthService {
  users: User[];
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private url = 'http://localhost:3000/api';  // url to web api

  cachedRequests: Array<HttpRequest<any>> = [];
data: any;
  constructor(private http: HttpClient,
              private router: Router,
              private messageService: MessageService) {
  }


  login(username: string, password: string) {
   return this.http.post('http://localhost:3000/api/login', {username: username, password: password}, {headers: new HttpHeaders().set('Authorization', 'Bearer' + 'token')}).pipe(
      res => res);
  }


  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expires_at');
  }

   public getToken(): string {
    return localStorage.getItem('token');
  }

  public getRefreshToken(): string {
       return localStorage.getItem('refreshToken');
  }


  public getNewAcessToken() {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const userName = localStorage.getItem('username');
    const body = new URLSearchParams();
    body.set(refreshToken, userName);
    if (token != null && refreshToken != null) {
      return this.http.post('http://localhost:3000/api/login/refresh', body, httpOptions)
        .subscribe((res: any) => {
          if (res) {
            this.data = res;
            const expiresAt = JSON.stringify((this.data.expiresIn * 10) + Date.now());
            localStorage.setItem('token', this.data.token);
            localStorage.setItem('refreshToken', this.data.refreshToken);
            localStorage.setItem('expires_at', expiresAt);
            this.router.navigate(['/homepage']);
          }
        });
    } else {
      console.error('An error occurred');
    }
  }

  public collectFailedRequest(request): void {
    this.cachedRequests.push(request);
  }
  public retryFailedRequests(): void {
    // retry the requests. this method can
    // be called after the token is refreshed
  }

 public getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    if (!token) {
      token = this.getToken();
    }
    if (!token) {
      return true;
    }

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) {
      return false;
    }
    return !(date.valueOf() > new Date().valueOf());
    }

  public getRefTokenExpirationDate(refreshToken: string): Date {
    const decoded = jwt_decode(refreshToken);

    if (decoded.exp === undefined) {
      return null;
    }
    this.router.navigate(['/login']);
  }

  isRefTokenExpired(refreshToken?: string): boolean {
    if (!refreshToken) {
      refreshToken = this.getRefreshToken();
    }
    if (!refreshToken) {
      return true;
    }

    const date = this.getRefTokenExpirationDate(refreshToken);
    if (date === undefined) {
      return false;
    }
    return !(date.valueOf() > new Date().valueOf());
  }
}
