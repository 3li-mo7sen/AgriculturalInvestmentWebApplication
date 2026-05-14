import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule, CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
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

  onSubmitForget() {
       if(this.forgetPasswordForm.valid){
         console.log(this.forgetPasswordForm.value);
         // استدعاء خدمة الـ auth هنا
       }
     }

 

}
