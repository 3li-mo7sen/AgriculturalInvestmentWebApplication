import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminUser, CreateUserData } from '../../../../../../models/admin-accounts';
import { AdminService } from '../../../../../../services/adminService/admin.service';



@Component({
  selector: 'app-admin-accounts-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-accounts-list.html',
  styleUrls: ['./admin-accounts-list.css'],
})
export class AdminAccountsList {
  @Output() userCreated = new EventEmitter<void>();

  users: AdminUser[] = [];
  isLoading = false;
  searchQuery = '';

  selectedRole = 'All Roles';
  selectedStatus = 'All Status';

  
  showAddUserModal = false;
  isSubmitting = false;
  modalErrorMessage = '';

  newUser: CreateUserData = {
    name: '',
    email: '',
    password: '',
    role: 'Farmer',
    phoneNumber: '',
    landDetails: '',
    balance: 0
  };

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.adminService.getUsers(this.selectedRole, this.selectedStatus, this.searchQuery)
      .subscribe({
        next: (data) => {
          this.users = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching users:', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  onSearchChange(): void {
    this.fetchUsers();
  }

  selectRole(role: string): void {
    this.selectedRole = role;
    this.fetchUsers();
  }

  selectStatus(status: string): void {
    this.selectedStatus = status;
    this.fetchUsers();
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  getRoleBadgeClass(role: string): string {
    switch (role?.toLowerCase()) {
      case 'expert': return 'badge-expert';
      case 'investor': return 'badge-investor';
      case 'farmer': return 'badge-farmer';
      case 'admin': return 'badge-admin';
      default: return 'badge-role';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'verified':
        return 'badge-active';
      case 'pending':
        return 'badge-pending';
      case 'suspended':
      case 'inactive':
      case 'rejected':
        return 'badge-suspended';
      default:
        return '';
    }
  }

  getDisplayRole(): string {
    if (this.selectedRole === 'All Roles') return 'All Roles';
    return this.selectedRole.charAt(0).toUpperCase() + this.selectedRole.slice(1) + 's';
  }

  
  openAddUserModal(): void {
    this.showAddUserModal = true;
    this.modalErrorMessage = '';
  }

  closeAddUserModal(): void {
    this.showAddUserModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newUser = {
      name: '',
      email: '',
      password: '',
      role: 'Farmer',
      phoneNumber: '',
      landDetails: '',
      balance: 0
    };
  }

  submitCreateUser(): void {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      this.modalErrorMessage = 'Name, email, and password are required.';
      return;
    }

    this.isSubmitting = true;
    this.modalErrorMessage = '';

    this.adminService.createUser(this.newUser).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeAddUserModal();
        this.fetchUsers();
        this.userCreated.emit();
      },
      error: (err) => {
        console.error('Error creating user:', err);
        this.modalErrorMessage = err.error?.message || 'Failed to create user.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }
}
