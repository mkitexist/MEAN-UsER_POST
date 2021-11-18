// @ts-nocheck

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth.data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
// const BACKEND_URL = environment.apiUrl + "users/";
// const BACKEND_URL = "https://meaan-app.herokuapp.com/api/users/";
const BACKEND_URL = "https://mean-appuserpost.herokuapp.com/api/users/";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: any = "";
  authorization = false;
  tokenTimer!: any;
  userId: string;
  getToken() {
    return this.token;
  }
  authstatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) { }
  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password }
    this.http.post(BACKEND_URL + "signup", authData).subscribe((e: any) => {
      // console.log(e);
      this.router.navigate(["/"]);
    }, error => {
      this.authstatusListener.next(false);
    });
    // console.log("useruser already exist");
    // this.router.navigate(["/"]);

  }
  getAuthStatusListener() {
    return this.authstatusListener.asObservable();
  }
  loginUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password }
    this.http.post(BACKEND_URL + "login", authData).subscribe((e: any) => {
      // console.log(e);
      const token = e.token;
      this.token = token;
      // console.log("token ", this.token);
      if (token) {
        this.authorization = true;
        const tokenExpire = e.expiresIn;
        this.userId = e.userId;
        this.setAuthTimer(tokenExpire);
        // console.log("token expire", tokenExpire);
        this.authstatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + tokenExpire * 100);
        this.saveToken(token, expirationDate, this.userId);
      }
      this.router.navigate(["/"]);

    },
      error => {
        this.authstatusListener.next(false);
      }
    )
  }
  logout() {
    this.token = "";
    this.authorization = false;
    this.authstatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.router.navigate(["/"]);
    this.userId = null;
    this.clearToken();
  }
  getAuthData() {
    const authInformation = this.getTokeen();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation?.expirationDate?.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation?.token;
      this.authorization = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authstatusListener.next(true);
    }
  }
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
  private saveToken(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }
  private getTokeen() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId
    }
  }
  private clearToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
}
