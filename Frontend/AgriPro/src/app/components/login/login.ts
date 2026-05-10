import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [JsonPipe,ReactiveFormsModule,CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  serverError: any = null;

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
        next: (res:any) => {
          this.serverError = null;
          this._AuthService.saveToken(res.token);

          const role = this._AuthService.redirectUser();

          
        },
        error: (err) => {
          console.log(err);

          this.serverError = err.error  || 'something went wrong';
        }
      });

    }
  }

}
