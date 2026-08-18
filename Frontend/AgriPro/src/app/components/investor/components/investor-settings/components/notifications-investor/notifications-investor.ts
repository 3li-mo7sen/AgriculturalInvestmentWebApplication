import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AccountSettings } from '../../../../../../models/user-settings';
import { AccountService } from '../../../../../../services/account/account.service';

@Component({
  standalone: true,
  selector: 'app-notifications-investor',
  imports: [CommonModule],
  templateUrl: './notifications-investor.html',
  styleUrls: ['./notifications-investor.css'],
})
export class NotificationsInvestor {
  settings: AccountSettings = {
    emailNotifications: true,
    smsNotifications: true,
    investmentAlerts: true,
    projectUpdates: true,
    marketingEmails: false
  };

  isLoading = false;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.isLoading = true;
    this.accountService.getAccountSettings().subscribe({
      next: (res) => {
        this.settings = { ...this.settings, ...res };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading notification settings:', err);
        this.isLoading = false;
      }
    });
  }

  toggleSetting(key: keyof AccountSettings): void {
    const newValue = !this.settings[key];
    this.settings[key] = newValue as any;

    this.accountService.updateAccountSettings({ [key]: newValue }).subscribe({
      error: (err) => {
        console.error(`Error updating ${key}:`, err);
        this.settings[key] = !newValue as any;
      }
    });
  }
}
