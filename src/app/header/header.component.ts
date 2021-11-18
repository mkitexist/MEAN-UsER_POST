import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  authListener!: Subscription;
  constructor(private authService: AuthService) { }
  userAutnenticated = false;
  ngOnInit(): void {
    this.userAutnenticated = this.authService.authorization;
    this.authListener = this.authService.authstatusListener.subscribe((e: any) => {
      // console.log("eee", e);
      if (e === true) {
        this.userAutnenticated = true;
      } else {
        this.userAutnenticated = e;

      }
    })
  }
  ngOnDestroy(): void {
    this.authListener.unsubscribe();
  }
  onLogout() {
    this.authService.logout();
  }
}
