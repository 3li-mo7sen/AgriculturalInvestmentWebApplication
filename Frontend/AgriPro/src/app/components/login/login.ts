import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [JsonPipe,ReactiveFormsModule,CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {

  serverError: any = null;
  isPasswordVisible: boolean = false;

  constructor(
    private _AuthService: AuthService,
    private _Router:Router
  ) { }

  loginForm: FormGroup = new FormGroup({

    email: new FormControl(null, [
      Validators.required,
      Validators.email
    ]),

    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(6)
    ])

  });

 
  login(): void {
    if (this.loginForm.valid) {
      this._AuthService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          if (res.statusCode === 200) {
            this.serverError = null;

            
            this._AuthService.saveUserStatus(res);

           
            this._AuthService.redirectUser();
          }
        },
        error: (err) => {
          console.error(err);
     
          this.serverError = err.error?.message || 'Invalid email or password';
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}



