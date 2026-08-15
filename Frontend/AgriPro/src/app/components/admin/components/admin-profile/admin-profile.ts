import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AccountService } from '../../../../services/account/account.service';
import { UserProfile } from '../../../../models/user-profile';

@Component({
  selector: 'app-admin-profile',
  imports: [CommonModule],
  templateUrl: './admin-profile.html',
  styleUrl: './admin-profile.css',
})
export class AdminProfile {
  userProfile: UserProfile | null = null;
  isLoading: boolean = true;
  userInitials: string = '';

  constructor(
    private accountService: AccountService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  fetchUserProfile(): void {
    this.isLoading = true;
    this.accountService.getUserProfile().subscribe({
      next: (data) => {
        this.userProfile = data;
        this.generateInitials(data.name);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading admin profile data:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private generateInitials(name: string): void {
    if (!name) return;
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      this.userInitials = (parts[0][0] + parts[1][0]).toUpperCase();
    } else {
      this.userInitials = name.substring(0, 2).toUpperCase();
    }
  }
}
