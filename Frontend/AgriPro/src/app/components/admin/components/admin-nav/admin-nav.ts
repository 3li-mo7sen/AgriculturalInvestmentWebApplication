import { ChangeDetectorRef, Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { UserProfile } from '../../../../models/user-profile';
import { AccountService } from '../../../../services/account/account.service';

@Component({
  selector: 'app-admin-nav',
  imports: [CommonModule],
  templateUrl: './admin-nav.html',
  styleUrls: ['./admin-nav.css'],
})
export class AdminNav {
  pageTitle = 'Dashboard';
  pageSubtitle = "Welcome back, Admin! Here's your admin overview.";
  showNotificationsMenu = false;
  showAccountMenu = false;

  userProfile: UserProfile | null = null;
  isLoading: boolean = true;
  userInitials: string = '';

  private router = inject(Router);

  private readonly pageMap = new Map<string, { title: string; subtitle: string }>([
    ['dashboard', { title: 'Dashboard', subtitle: "Welcome back, Admin! Here's your admin overview." }],
    ['manage-accounts', { title: 'Manage Accounts', subtitle: 'Manage user accounts and roles' }],
    ['manage-projects', { title: 'Manage Projects', subtitle: 'Review and manage agricultural projects' }],
    ['approve-documents', { title: 'Approve Documents', subtitle: 'Review and approve user documents' }],
    ['reports', { title: 'Reports', subtitle: 'View system reports and alerts' }],
    ['profile', { title: 'My Profile', subtitle: 'View and manage your account details' }],
    ['settings', { title: 'Settings', subtitle: 'Manage admin preferences' }],
  ]);

  constructor(private accountService: AccountService, private cdr: ChangeDetectorRef) {
    this.updateHeader(this.router.url);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateHeader(event.urlAfterRedirects);
      }
    });
  }

  private updateHeader(url: string) {

    if (url.includes('/settings')) {
      const config = this.pageMap.get('settings');
      this.pageTitle = config?.title ?? 'Settings';
      this.pageSubtitle = config?.subtitle ?? '';
      return;
    }

    const segments = url.split('/').filter(Boolean);
    const pageKey = segments.length ? segments[segments.length - 1] : 'dashboard';
    const effectiveKey = ['security', 'notifications', 'preferences'].includes(pageKey)
      ? 'settings'
      : pageKey;
    const config = this.pageMap.get(effectiveKey) ?? this.pageMap.get('dashboard');

    this.pageTitle = config?.title ?? 'Dashboard';
    this.pageSubtitle = config?.subtitle ?? '';
  }

  toggleNotifications(event: MouseEvent) {
    event.stopPropagation();
    this.showNotificationsMenu = !this.showNotificationsMenu;
    if (this.showNotificationsMenu) {
      this.showAccountMenu = false;
    }
  }

  toggleAccount(event: MouseEvent) {
    event.stopPropagation();
    this.showAccountMenu = !this.showAccountMenu;
    if (this.showAccountMenu) {
      this.showNotificationsMenu = false;
    }
  }

  @HostListener('document:click')
  closeMenus() {
    this.showNotificationsMenu = false;
    this.showAccountMenu = false;
  }

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
        console.error('Error loading expert profile data:', err);
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
  /*
  markAllRead(event: MouseEvent) {
    event.stopPropagation();
    this.showNotificationsMenu = false;
  }

  goToNotifications() {
    this.showNotificationsMenu = false;
    this.router.navigate(['/admin/settings/notifications']);
  }
  */
  goToProfile() {
    this.showAccountMenu = false;
    this.router.navigate(['/admin/profile']);
  }
  /*
  goToSettings() {
    this.showAccountMenu = false;
    this.router.navigate(['/admin/settings']);
  }

  goToHelpCenter() {
    this.showAccountMenu = false;
  }
  
  logout() {
    this.showAccountMenu = false;
    this.router.navigate(['/login']);
  }
  */
}
