import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../login/login';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment.development';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [ReactiveFormsModule,CommonModule,Login,RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register implements OnInit{
  registerForm!: FormGroup;
  currentStep: number = 1; // الخطوة الحالية
  selectedRole: 'farmer' | 'investor' | null = null;
  serverError: any = null;
  constructor(private fb: FormBuilder,private _HttpClient:HttpClient) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.registerForm = this.fb.group({
      role: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['',[Validators.required,Validators.pattern(/^01[0125][0-9]{8}$/)]], // هضيفلها الـ Validation وقت اختيار الـ Farmer
      landDetails: [''], // هضيفلها الـ Validation وقت اختيار الـ Farmer
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  // ميثود للتأكد إن كلمة السر متطابقة
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  // عند اختيار الدور
  // عند اختيار الدور
  selectRole(role: 'farmer' | 'investor') {
    this.selectedRole = role;
    this.registerForm.get('role')?.setValue(role);

    if (role === 'farmer') {
      this.registerForm.get('phoneNumber')?.setValidators([Validators.required]);
      this.registerForm.get('landDetails')?.setValidators([Validators.required]);
    } else {
      this.registerForm.get('phoneNumber')?.clearValidators();
      this.registerForm.get('landDetails')?.clearValidators();
    }

    this.registerForm.get('phoneNumber')?.updateValueAndValidity();
    this.registerForm.get('landDetails')?.updateValueAndValidity();

    // ا مسحي السطر بتاع this.currentStep = 2 من هنا
    // عشان اليوزر يختار براحته والزرار يظهر، وبعدين يدوس Continue براحته
  }

  goBack() {
    this.currentStep = 1;
    this.selectedRole = null;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formData = this.registerForm.value;

    // هنشيل confirmPassword قبل الإرسال
    //delete formData.confirmPassword;

    let apiUrl = '';

    if (this.selectedRole === 'farmer') {
      apiUrl = `${environment.baseUrl}/api/Auth/register/farmer`;
    } else if (this.selectedRole === 'investor') {
      apiUrl = `${environment.baseUrl}/api/Auth/register/investor`;
    }

    this._HttpClient.post(apiUrl, formData).subscribe({
      
      next: (res: any) => {
        console.log('Register Success:', res);

        alert('Registration successful. Please check your email.');


        this.currentStep = 1;
        this.registerForm.reset();
        this.selectedRole = null;
      },
      error: (err) => {

        console.log(err.error); // مهم جدًا عشان نشوف الشكل

        if (err.error?.errors) {

          const validationErrors = err.error.errors;

          let messages: string[] = [];

          for (const field in validationErrors) {
            messages.push(...validationErrors[field]);
          }

          this.serverError = messages.join(' | ');
        }
        else {
          this.serverError = err.error?.title || 'Something went wrong.';
        }

      
      }
    });
    
  }
}



