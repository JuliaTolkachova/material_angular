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



const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class AuthService {
  users: User[];
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private url = 'http://localhost:3000/api';  // url to web api

  cachedRequests: Array<HttpRequest<any>> = [];

  constructor(private http: HttpClient,
              private messageService: MessageService) {
  }


  login(username: string, password: string) {
    return this.http.post('http://localhost:3000/api/login', {username: username, password: password}, httpOptions).pipe(
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
    return this.http.post('http://localhost:3000/api/login/refresh', {'refreshToken': this.getRefreshToken()});
  }

  public isAuthenticated(): boolean {
     const token = this.getToken();
        return tokenNotExpired(token);
  }
  public collectFailedRequest(request): void {
    this.cachedRequests.push(request);
  }

}
