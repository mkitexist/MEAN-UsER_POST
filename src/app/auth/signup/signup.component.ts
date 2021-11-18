import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService) { }

  isLoading = false;
  authstatusSubsciption!: Subscription;
  ngOnInit(): void {
    this.authstatusSubsciption = this.authService.getAuthStatusListener().subscribe((status: any) => {
      this.isLoading = false;
    })
  }
  onSignUP(loginForm: NgForm) {
    // console.log("login form", loginForm.value)
    if (loginForm.invalid) {
      return
    } else {
      this.isLoading = true;
      this.authService.createUser(loginForm.value.email, loginForm.value.password)
    }
  }
  ngOnDestroy(): void {
    this.authstatusSubsciption.unsubscribe();
  }
}
