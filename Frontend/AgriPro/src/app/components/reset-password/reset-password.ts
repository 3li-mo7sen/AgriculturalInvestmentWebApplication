import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule,CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {
  serverError: any = null;
  isPasswordVisible: boolean = false;
  isRePasswordVisible: boolean = false;
  email: string = '';
  token: string = '';

  resetPasswordForm: FormGroup = new FormGroup({
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(6) 
    ]),
    rePassword: new FormControl(null, [Validators.required])
  }, { validators: this.passwordMatchValidator });

  constructor(private _ActivatedRoute: ActivatedRoute, private _AuthService: AuthService, private _Router: Router) {
   
    this._ActivatedRoute.queryParams.subscribe(params => {
      this.email = params['email'];
      this.token = params['token'];
    });
  }

 
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const rePassword = control.get('rePassword');
    return password && rePassword && password.value !== rePassword.value ? { mismatch: true } : null;
  }

  submitReset() {
    if (this.resetPasswordForm.valid) {
      const model = {
        email: this.email,
        token: this.token,
        password: this.resetPasswordForm.value.password
      };

      this._AuthService.resetPassword(model).subscribe({
        next: (res) => {
          alert("Password reset successfully!");
          this._Router.navigate(['/login']);
        },
        error: (err) => {
          
          this.serverError = err.error?.message || "Invalid or expired token";
        }
      });
    }
  }

 
  resend() {
    this._AuthService.resendResetPassword(this.email).subscribe({
      next: () => alert("New reset link sent to your email")
    });
  }

  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleRePassword(): void {
    this.isRePasswordVisible = !this.isRePasswordVisible;
  }


}
