import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface User {
  avatar: string;
  name: string;
  email: string;
  role: string;
  status: string;
  kyc: string;
  location: string;
  joinDate: string;
}

@Component({
  selector: 'app-admin-accounts-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-accounts-list.html',
  styleUrls: ['./admin-accounts-list.css'],
})
export class AdminAccountsList {
  users: User[] = [
    {
      avatar: 'AH',
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@email.com',
      role: 'farmer',
      status: 'active',
      kyc: 'verified',
      location: 'Fayoum, Egypt',
      joinDate: '2024-01-10',
    },
    {
      avatar: 'MA',
      name: 'Mohamed Ali',
      email: 'mohamed.ali@email.com',
      role: 'investor',
      status: 'active',
      kyc: 'verified',
      location: 'Cairo, Egypt',
      joinDate: '2024-01-08',
    },
    {
      avatar: 'DFI',
      name: 'Dr. Fatma Ibrahim',
      email: 'fatma.ibrahim@email.com',
      role: 'expert',
      status: 'active',
      kyc: 'verified',
      location: 'Alexandria, Egypt',
      joinDate: '2024-01-05',
    },
    {
      avatar: 'KM',
      name: 'Khaled Mahmoud',
      email: 'khaled.mahmoud@email.com',
      role: 'farmer',
      status: 'pending',
      kyc: 'pending',
      location: 'Ismailia, Egypt',
      joinDate: '2024-01-15',
    },
    {
      avatar: 'SA',
      name: 'Sara Ahmed',
      email: 'sara.ahmed@email.com',
      role: 'investor',
      status: 'suspended',
      kyc: 'rejected',
      location: 'Giza, Egypt',
      joinDate: '2023-12-20',
    },
    {
      avatar: 'OF',
      name: 'Omar Farouk',
      email: 'omar.farouk@email.com',
      role: 'farmer',
      status: 'active',
      kyc: 'verified',
      location: 'Beheira, Egypt',
      joinDate: '2023-11-15',
    },
  ];

  selectedRole = 'All Roles';
  selectedStatus = 'All Status';

  constructor(private elementRef: ElementRef) {}

  selectRole(role: string): void {
    this.selectedRole = role;
  }

  selectStatus(status: string): void {
    this.selectedStatus = status;
  }

  getFilteredUsers(): User[] {
    return this.users.filter((user) => {
      const roleMatch =
        this.selectedRole === 'All Roles' ||
        user.role.toLowerCase() === this.selectedRole.toLowerCase();
      const statusMatch =
        this.selectedStatus === 'All Status' ||
        user.status.toLowerCase() === this.selectedStatus.toLowerCase();
      return roleMatch && statusMatch;
    });
  }

  getRoleBadgeClass(role: string): string {
    if (role === 'expert') return 'badge-expert';
    return 'badge-role';
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active':
        return 'badge-active';
      case 'verified':
        return 'badge-verified';
      case 'pending':
        return 'badge-pending';
      case 'suspended':
        return 'badge-suspended';
      case 'rejected':
        return 'badge-rejected';
      default:
        return '';
    }
  }

  getDisplayRole(): string {
    if (this.selectedRole === 'All Roles') return 'All Roles';
    return this.selectedRole.charAt(0).toUpperCase() + this.selectedRole.slice(1) + 's';
  }
}
