import { ChangeDetectorRef, Component } from '@angular/core';
import { UserProfile } from '../../../../models/user-profile';
import { AccountService } from '../../../../services/account/account.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-farmer-profile2',
  imports: [CommonModule],
  templateUrl: './farmer-profile2.html',
  styleUrl: './farmer-profile2.css',
})
export class FarmerProfile2 {
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
        console.error('Error loading profile data:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
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
