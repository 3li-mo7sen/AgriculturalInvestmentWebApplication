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

 
  activeMenuUserId: number | null = null;

 
  showAddUserModal = false;
  showViewDetailsModal = false;
  showEditUserModal = false;
  showStatusModal = false;


  showDeleteModal = false;
  userToDelete: AdminUser | null = null;
  
  selectedUser: AdminUser | null = null;
  editUserData: any = {};
  newStatusValue: string = 'active';

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

  // this to close actions menu when click out
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.actions-dropdown-wrapper')) {
      this.activeMenuUserId = null;
    }
  }

  toggleActionsMenu(userId: number, event: MouseEvent): void {
    event.stopPropagation();
    this.activeMenuUserId = this.activeMenuUserId === userId ? null : userId;
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

  // view details
  openViewDetails(user: AdminUser): void {
    this.activeMenuUserId = null;
    this.isLoading = true; 

    this.adminService.getUserById(user.id).subscribe({
      next: (fullUser) => {
        this.selectedUser = fullUser;
        this.showViewDetailsModal = true;
        this.isLoading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error fetching details:', err);
        this.selectedUser = user;
        this.showViewDetailsModal = true;
        this.isLoading = false;
        this.cdr.detectChanges(); 
      }
    });
  }

  closeViewDetailsModal(): void {
    this.showViewDetailsModal = false;
    this.selectedUser = null;
  }

  // edit user :(
  openEditUser(user: AdminUser): void {
    this.activeMenuUserId = null;
    this.selectedUser = user;
    this.editUserData = {
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      location: user.location || ''
    };
    this.modalErrorMessage = '';
    this.showEditUserModal = true;
  }

  closeEditUserModal(): void {
    this.showEditUserModal = false;
    this.selectedUser = null;
  }

  submitEditUser(): void {
    if (!this.selectedUser) return;

    this.isSubmitting = true;
    this.modalErrorMessage = '';

    
    const updatedPayload = {
      name: this.editUserData.name,
      fullName: this.editUserData.name,
      email: this.editUserData.email,
      phone: this.editUserData.phone,
      phoneNumber: this.editUserData.phone,
      location: this.editUserData.location || ''
    };

    this.adminService.updateUser(this.selectedUser.id, updatedPayload).subscribe({
      next: (res) => {
        console.log('Update success:', res);
        this.isSubmitting = false;
        this.closeEditUserModal(); 
        this.fetchUsers();        
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Update error:', err);
      
        if (err.status === 200 || err.status === 204) {
          this.isSubmitting = false;
          this.closeEditUserModal();
          this.fetchUsers();
        } else {
          this.modalErrorMessage = err.error?.message || 'Failed to update user.';
          this.isSubmitting = false;
        }
        this.cdr.detectChanges();
      }
    });
  }

  // change status
  openChangeStatus(user: AdminUser): void {
    this.activeMenuUserId = null;
    this.selectedUser = user;
    this.newStatusValue = user.status?.toLowerCase() || 'active';
    this.showStatusModal = true;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    this.selectedUser = null;
  }

  submitChangeStatus(): void {
    if (!this.selectedUser) return;

    this.isSubmitting = true;
    this.modalErrorMessage = '';

    this.adminService.updateUserStatus(this.selectedUser.id, this.newStatusValue).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.closeStatusModal();
        this.fetchUsers();
        this.userCreated.emit();
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 200 || err.status === 204) {
          this.isSubmitting = false;
          this.closeStatusModal();
          this.fetchUsers();
          this.userCreated.emit();
        } else {
          this.modalErrorMessage = err.error?.message || 'Failed to change status.';
          this.isSubmitting = false;
        }
        this.cdr.detectChanges();
      }
    });
  }

  //  delete user 
  confirmDeleteUser(user: AdminUser): void {
    this.activeMenuUserId = null;
    this.userToDelete = user;
    this.modalErrorMessage = '';
    this.showDeleteModal = true;
    this.cdr.detectChanges();
  }

  closeDeleteModal(): void {
    if (this.isSubmitting) return;
    this.showDeleteModal = false;
    this.userToDelete = null;
    this.modalErrorMessage = '';
  }

  submitDeleteUser(): void {
    if (!this.userToDelete) return;

    this.isSubmitting = true;
    this.modalErrorMessage = '';

    this.adminService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeDeleteModal();
        this.fetchUsers();
        this.userCreated.emit();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        this.modalErrorMessage = err.error?.message || 'Failed to delete user.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  // create user
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

  // helper functions
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

}
