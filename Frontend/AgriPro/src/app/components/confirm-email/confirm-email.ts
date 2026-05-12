import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environment/environment.development';

@Component({
  selector: 'app-confirm-email',
  imports: [CommonModule],
  templateUrl: './confirm-email.html',
  styleUrl: './confirm-email.css'
})
export class ConfirmEmailComponent implements OnInit {

  email!: string;
  code!: string;

  message: string = '';
  isLoading: boolean = true;
  canResend: boolean = false;
  isSuccess: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.code = params['code'];

      if (this.email && this.code) {
        this.verifyEmail();
      } else {
        this.message = 'Invalid confirmation link.';
        this.isLoading = false;
      }
    });
  }

  verifyEmail() {

    this.isLoading = true;
    this.canResend = false;

    this.http.get(`${environment.baseUrl}/api/Auth/active`, {
      params: {
        email: this.email,
        code: this.code
      }
    }).subscribe({
      next: (res: any) => {

        if (res?.success === true) {
          this.isSuccess = true;
          this.message = 'Email verified successfully ✔';
          this.isLoading = false;

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 6000);
        } else {
          this.message = res?.message || 'Verification failed.';
          this.canResend = true;
        }

        this.isLoading = false;
      },

      error: (err) => {
        console.log(err);
        this.message = err.error?.message || 'Something went wrong.';
        this.canResend = true;
        this.isLoading = false;
      }
    });
  }

  resendEmail() {

    this.http.get(`${environment.baseUrl}/api/Auth/resend-activation`, {
      params: {
        email: this.email
      }
    }).subscribe({
      next: () => {
        alert("Activation email sent again ✔");
        this.canResend = false;
      },
      error: () => {
        alert("Failed to resend email ❌");
      }
    });
  }
}


