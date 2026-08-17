import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../../../../services/account/account.service';
import { AccountSettings, ChangePasswordRequest } from '../../../../../../models/user-settings';

@Component({
  standalone: true,
  selector: 'app-security-farmer',
  imports: [CommonModule,FormsModule],
  templateUrl: './security-farmer.html',
  styleUrls: ['./security-farmer.css'],
})
export class SecurityFarmer implements OnInit{
  passwordData: ChangePasswordRequest = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  settings: AccountSettings = {
    twoFactorAuth: false,
    loginAlerts: true
  };

  showCurrentPassword = false;
  showNewPassword = false;

  isSubmittingPassword = false;
  passwordSuccess = '';
  passwordError = '';

  settingsSuccess = '';
  settingsError = '';

  constructor(private accountService: AccountService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadSecuritySettings();
  }

  loadSecuritySettings(): void {
    this.accountService.getAccountSettings().subscribe({
      next: (res) => {
        this.settings.twoFactorAuth = res.twoFactorAuth ?? false;
        this.settings.loginAlerts = res.loginAlerts ?? true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading security settings', err);
        this.cdr.detectChanges();
      }

    });
  }

  onChangePassword(): void {
    this.passwordSuccess = '';
    this.passwordError = '';

    if (!this.passwordData.currentPassword || !this.passwordData.newPassword || !this.passwordData.confirmPassword) {
      this.passwordError = 'Please fill in all password fields.';
      return;
    }

    if (this.passwordData.newPassword.length < 6) {
      this.passwordError = 'New password must be at least 6 characters long.';
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.passwordError = 'New password and confirm password do not match.';
      return;
    }

    this.isSubmittingPassword = true;

    this.accountService.changePassword(this.passwordData).subscribe({
      next: (res) => {
        this.isSubmittingPassword = false;
        this.passwordSuccess = res.message || 'Password changed successfully.';
        this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmittingPassword = false;
        this.passwordError = err.error?.message || 'Current password is incorrect.';
        this.cdr.detectChanges();
      }
    });
  }

  onToggleSetting(key: 'twoFactorAuth' | 'loginAlerts'): void {
    this.settings[key] = !this.settings[key];
    this.accountService.updateAccountSettings({ [key]: this.settings[key] }).subscribe({
      next: (res) => {
        this.settingsSuccess = 'Security option updated.';
        setTimeout(() => {
          this.settingsSuccess = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.settingsError = 'Failed to update option.';
        this.settings[key] = !this.settings[key];
        this.cdr.detectChanges();
      }
    });
  }
}
