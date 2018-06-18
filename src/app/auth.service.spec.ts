import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {catchError, map, tap} from 'rxjs/operators';
import 'rxjs/add/operator/map';
import {User} from './user';
import {HttpClient, HttpHeaders} from '@angular/common/http';



const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class AuthService {
  private heroesUrl = 'http://localhost:3000/api/login';  // url to web api

  result: any;

  constructor(private http: HttpClient) {
  }
/*
  registerUser(user: User) {
    const body: User = {
      username: user.username,
      password: user.password,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastmame
    };
*/
/*
    userAuthentication(userName, password)
    {
      let data = 'username=' + u
      sername + '&password=' + password + '&grant_type=password';
      let reqHeader = new HttpHeaders({'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True'});
      return this.http.post(this.rootUrl + '/token', data, {headers: reqHeader});
    }

    getUserClaims()
    {
      return this.http.get(this.rootUrl + '/api/getUserClaims');
    }
  } */
 }
