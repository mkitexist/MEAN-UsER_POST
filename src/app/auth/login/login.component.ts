import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService) { }

  isLoading = false;
  authstatusSubsciption!: Subscription;
  ngOnInit(): void {
    this.authstatusSubsciption = this.authService.getAuthStatusListener().subscribe((status: any) => {
      this.isLoading = false;
    })
  }
  onLogin(loginForm: NgForm) {
    // console.log("login form", loginForm.value)
    this.authService.loginUser(loginForm.value.email, loginForm.value.password);
    this.isLoading = true;

  }
  ngOnDestroy(): void {
    this.authstatusSubsciption.unsubscribe();
  }
}
