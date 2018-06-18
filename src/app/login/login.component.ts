import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {DialogComponent, DialogConfig} from '../dialog/dialog.component';
import {MatDialog} from '@angular/material';
import {User} from '../user';
import {AuthService} from '../auth.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  users: User[];

  loginData = { username: '', password: '' };
  message = '';
  data: any;

  returnUrl: string;

  constructor( private route: ActivatedRoute,
               private router: Router,
               private dialog: MatDialog,
               private authService: AuthService,
               private http: HttpClient) { }

  ngOnInit() {
        this.authService.logout();
  }


  login() {
    this.authService.login(this.loginData.username, this.loginData.password).subscribe(res => {
      this.data = res;
      const expiresAt = JSON.stringify((this.data.expiresIn * 10) + Date.now());
      localStorage.setItem('token', this.data.token);
      localStorage.setItem('refreshToken', this.data.refreshToken);
      localStorage.setItem('expires_at', expiresAt);
      this.router.navigate(['/homepage']);
    }, err => {
      this.message = err.error.msg;
      this.showAlert();
     });
  }

  showAlert(): void {
    const dialog: DialogConfig = {
      title: 'Username or password is incorrect',
      close: 'OK'
    };
    this.dialog.open(DialogComponent, { width: '287px', data: dialog });
  }
}
