import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule,CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {
  serverError: any = null;

  resetPasswordForm: FormGroup = new FormGroup({
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8) // خليتها 8 زي ما في الـ Placeholder بتاع الصورة
    ]),
    rePassword: new FormControl(null, [Validators.required])
  }, { validators: this.passwordMatchValidator });

  // دالة للتأكد من تطابق الباسورد
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const rePassword = control.get('rePassword');
    return password && rePassword && password.value !== rePassword.value ? { mismatch: true } : null;
  }
}
