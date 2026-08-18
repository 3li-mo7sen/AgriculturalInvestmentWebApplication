import { ChangeDetectorRef, Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { UserProfile } from '../../../../models/user-profile';
import { AccountService } from '../../../../services/account/account.service';

@Component({
  standalone: true,
  selector: 'app-investor-nav',
  imports: [CommonModule],
  templateUrl: './investor-nav.html',
  styleUrls: ['./investor-nav.css'],
})
export class InvestorNav {
  pageTitle = 'Dashboard';
  pageSubtitle = 'Track your agricultural investments and returns';
  showNotificationsMenu = false;
  showAccountMenu = false;

  userProfile: UserProfile | null = null;
  isLoading: boolean = true;
  userInitials: string = '';

  private router = inject(Router);

  private readonly pageMap = new Map<string, { title: string; subtitle: string }>([
    ['dashboard', { title: 'Dashboard', subtitle: 'Track your agricultural investments and returns' }],
    ['available-projects', { title: 'Available Projects', subtitle: 'Browse and invest in verified agricultural projects' }],
    ['project-details/:id', { title: 'Project Details', subtitle: 'Review and invest in this project' }],
    ['my-investments', { title: 'My Investments', subtitle: 'Track and manage your agricultural investments' }],
    ['investment-history', { title: 'Investment History', subtitle: 'View your complete investment transaction history' }],
    ['wallet', { title: 'Wallet', subtitle: 'Manage your investment funds' }],
    ['profile', { title: 'My Profile', subtitle: 'Manage your profile and account details' }],
    ['settings', { title: 'settings', subtitle: 'Manage your account preferences' }],
  ]);

  constructor(private accountService: AccountService,
              private cdr: ChangeDetectorRef) {
    this.updateHeader(this.router.url);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateHeader(event.urlAfterRedirects);
      }
    });
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


  private updateHeader(url: string) {
    if (url.includes('/settings')) {
      const config = this.pageMap.get('settings');
      this.pageTitle = config?.title ?? 'Settings';
      this.pageSubtitle = config?.subtitle ?? 'Manage your account preferences';
      return;
    }

   
    if (url.includes('project-details')) {
      const config = this.pageMap.get('project-details');
      this.pageTitle = config?.title ?? 'Project Details';
      this.pageSubtitle = config?.subtitle ?? 'Review and invest in this project';
      return;
    }

  
    if (url.includes('/profile')) {
      const config = this.pageMap.get('profile');
      this.pageTitle = config?.title ?? 'My Profile';
      this.pageSubtitle = config?.subtitle ?? 'Manage your profile and account details';
      return;
    }


    const segments = url.split('/').filter(Boolean);
    const pageKey = segments.length ? segments[segments.length - 1] : 'dashboard';
    const effectiveKey = ['profile', 'security', 'notifications', 'preferences'].includes(pageKey)
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
  /*
  @HostListener('document:click', ['$event'])
  closeMenus(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.closest('.dropdown-wrapper')) {
      return;
    }

    this.showNotificationsMenu = false;
    this.showAccountMenu = false;
  }

  markAllRead(event: MouseEvent) {
    event.stopPropagation();
    this.showNotificationsMenu = false;
  }

  goToNotifications() {
    this.showNotificationsMenu = false;
    this.router.navigate(['/investor/settings/notifications']);
  }
  */
  goToProfile() {
    this.showAccountMenu = false;
    this.router.navigate(['/investor/profile']);
  }

  goToSettings() {
    this.showAccountMenu = false;
    this.router.navigate(['/investor/settings']);
  }

  goToHelpCenter() {
    this.showAccountMenu = false;
  }

  logout() {
    this.showAccountMenu = false;
    this.router.navigate(['/login']);
  }
}
