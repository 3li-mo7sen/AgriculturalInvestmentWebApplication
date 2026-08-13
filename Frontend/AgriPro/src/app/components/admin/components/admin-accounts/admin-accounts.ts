import { ChangeDetectorRef, Component } from '@angular/core';
import { AdminAccountsCards } from './components/admin-accounts-cards/admin-accounts-cards';
import { AdminAccountsList } from './components/admin-accounts-list/admin-accounts-list';
import { CommonModule } from '@angular/common';
import { AdminUser } from '../../../../models/admin-accounts';
import { AdminService } from '../../../../services/adminService/admin.service';

@Component({
  selector: 'app-admin-accounts',
  imports: [AdminAccountsCards,AdminAccountsList,CommonModule],
  templateUrl: './admin-accounts.html',
  styleUrls: ['./admin-accounts.css'],
})
export class AdminAccounts {
  users: AdminUser[] = [];
  isLoading = true;

  totalUsers = 0;
  activeUsers = 0;
  pendingKycUsers = 0;
  suspendedUsers = 0;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadAllUsersForStats();
  }

  loadAllUsersForStats(): void {
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.calculateStats();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load users:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateStats(): void {
    this.totalUsers = this.users.length;
    this.activeUsers = this.users.filter(u => u.status?.toLowerCase() === 'active').length;
    this.pendingKycUsers = this.users.filter(u => u.kycStatus?.toLowerCase() === 'pending').length;
    this.suspendedUsers = this.users.filter(u =>
      u.status?.toLowerCase() === 'suspended' || u.status?.toLowerCase() === 'inactive'
    ).length;
  }

  onUserAdded(): void {
    this.loadAllUsersForStats();
  }
}
