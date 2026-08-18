import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpdateProfileRequest } from '../../../../../../models/user-settings';
import { AccountService } from '../../../../../../services/account/account.service';

@Component({
  selector: 'app-admin-settings-general',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-settings-general.html',
  styleUrls: ['./admin-settings-general.css'],
})
export class AdminSettingsGeneral {
  profileData: UpdateProfileRequest = {
    name: '',
    email: '',
    phone: '',
    location: '',
    landDetails: ''
  };

  isLoading = false;
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  constructor(private accountService: AccountService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.accountService.getUserProfile().subscribe({
      next: (profile) => {
        this.profileData = {
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          location: profile.location || ''

        };
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load profile data.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSave(): void {
    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload: UpdateProfileRequest = {
      name: this.profileData.name,
      email: this.profileData.email,
      phone: this.profileData.phone,
      location: this.profileData.location,
      landDetails: this.profileData.landDetails
    };

    this.accountService.updateProfile(payload).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.successMessage = res.message || 'Profile updated successfully!';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Cannot update profile.';
        this.cdr.detectChanges();
      }
    });
  }
}
