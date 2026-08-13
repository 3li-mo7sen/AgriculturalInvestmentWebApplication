import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-accounts-cards',
  imports: [CommonModule],
  templateUrl: './admin-accounts-cards.html',
  styleUrls: ['./admin-accounts-cards.css'],
})
export class AdminAccountsCards {
  @Input() totalUsers = 0;
  @Input() activeUsers = 0;
  @Input() pendingKycUsers = 0;
  @Input() suspendedUsers = 0;
}
