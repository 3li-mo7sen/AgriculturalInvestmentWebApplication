import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AccountService } from '../../../../services/account/account.service';
import { UserProfile } from '../../../../models/user-profile';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-investor-profile2',
  imports: [CommonModule],
  templateUrl: './investor-profile2.html',
  styleUrl: './investor-profile2.css',
})
export class InvestorProfile2 {
  profileData: UserProfile | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private accountService: AccountService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchProfileData();
  }

  fetchProfileData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.accountService.getUserProfile()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (data) => {
          this.profileData = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching profile:', err);
          this.errorMessage = 'Failed to load profile details.';
          this.cdr.detectChanges();
        }
      });
  }

  
  getInitials(name: string | undefined): string {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }
}
