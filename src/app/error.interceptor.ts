import { Component, Injectable, OnInit } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from './error/error.component';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor, OnInit {
  errormessage = "An unknown error occured"

  constructor(private dialoge: MatDialog, private route: ActivatedRoute) { }
  ngOnInit(): void {
    // this.route.params.subscribe((e: any) => {
    //   console.log(e);
    // })
    // let p = err.url;
    // if (p?.includes('login')) {
    //   errormessage = "invalid email or Password"
    // } else if (p?.includes('signUp')) {
    //   errormessage = "user with mailID Already registerd"
    // };
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        // let p = err.url;
        // // console.log("ppp", p);
        // if (p?.includes('login')) {
        //   // console.log("loginn", p?.includes('login'));
        //   this.errormessage = "invalid email or Password"
        // } else if (p?.includes('signup')) {
        //   // console.log("loginn", p?.includes('signup'));

        //   this.errormessage = "user with mailID Already registerd"
        // };
        // console.log("errr", err);
        if (err.error.message) {
          this.errormessage = err.error.message
        };
        // alert(err.error.error.message);
        this.dialoge.open(ErrorComponent, {
          // height: '150px',
          width: '300px',
          data: { message: this.errormessage },
        });
        // this.dialoge.open(ErrorComponent);
        return throwError(err);
      })
    );
  }
}
