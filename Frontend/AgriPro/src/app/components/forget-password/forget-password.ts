import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { email } from '@angular/forms/signals';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './forget-password.html',
  styleUrls: ['./forget-password.css'],
})
export class ForgetPassword {
  serverError: any = null;
  constructor(
    private _AuthService: AuthService,
    private _Router: Router
  ) { }

  forgetPasswordForm: FormGroup = new FormGroup({
    email: new FormControl(null, [
      Validators.required,
      Validators.email
    ])
  });

  sendEmail() {
    if (this.forgetPasswordForm.valid) {
      this._AuthService.forgetPassword(this.forgetPasswordForm.get('email')?.value).subscribe({
        next: (res) => {
          // إظهار رسالة نجاح: "Check your inbox"
          alert("Email sent! Please check your inbox.");
        },
        error: (err) => {
          this.serverError = err.error?.message || "Failed to send email";
        }
      });
    }
  }

 

}
