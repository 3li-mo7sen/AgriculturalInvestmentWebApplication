import { ChangeDetectorRef, Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { FarmerService } from '../../../../services/farmerService/farmer.service';
import { UserProfile } from '../../../../models/user-profile';
import { AccountService } from '../../../../services/account/account.service';

@Component({
  standalone: true,
  selector: 'app-farmer-nav',
  imports: [CommonModule],
  templateUrl: './farmer-nav.html',
  styleUrls: ['./farmer-nav.css'],
})
export class FarmerNav {
  userName = 'Farmer';
  pageTitle = 'Dashboard';
  pageSubtitle = "Welcome back, Ahmed! Here's your farming overview.";
  showNotificationsMenu = false;
  showAccountMenu = false;
  userProfile: UserProfile | null = null;
  isLoading: boolean = true;
  userInitials: string = '';

  private readonly pageMap = new Map<string, { title: string; subtitle: string }>([
    ['dashboard', { title: 'Dashboard', subtitle: "Welcome back, Ahmed! Here's your farming overview." }],
    ['create-project', { title: 'Create New Project', subtitle: 'Register your agricultural land for investment' }],
    ['my-projects', { title: 'My Projects', subtitle: 'Manage your agricultural investment projects' }],
    ['project-details', { title: 'Project Details', subtitle: 'View detailed information and status of your project' }],
    ['wallet', { title: 'Wallet', subtitle: 'Manage your funds and transactions' }],
    ['contracts', { title: 'Contracts', subtitle: 'Manage your investment contracts' }],
    ['profile', { title: 'My Profile', subtitle: 'Manage your farmer profile and account details' }],
    ['settings', { title: 'Settings', subtitle: 'Manage your account preferences' }],
  ]);

  constructor(private _AuthService: AuthService, private router: Router, private _FarmerService: FarmerService, private accountService: AccountService,
    private cdr: ChangeDetectorRef) {
    this.getUserData();
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
        console.error('Error loading profile data:', err);
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

  getUserData() {
    this._FarmerService.getDashboardData().subscribe({
      next: (res: any) => {
        if (res && res.user) {
          this.userName = res.user.name;
          this.updateHeader(this.router.url);
        }
      },
      error: (err) => console.error('Error fetching user data', err),
    });
  }

  private updateHeader(url: string) {

    if (url.includes('project-details')) {
      const config = this.pageMap.get('project-details');
      this.pageTitle = config?.title ?? 'Project Details';
      this.pageSubtitle = config?.subtitle ?? '';
      return;
    }

    const segments = url.split('/').filter(Boolean);
    const pageKey = segments.length ? segments[segments.length - 1] : 'dashboard';
    const effectiveKey = ['security', 'notifications', 'preferences'].includes(pageKey) ? 'settings' : pageKey;
    const config = this.pageMap.get(effectiveKey) ?? this.pageMap.get('dashboard');

    this.pageTitle = config?.title ?? 'Dashboard';
    this.pageSubtitle = config?.subtitle ?? '';
  }
  
  @HostListener('document:click', ['$event'])
  closeMenus(event: MouseEvent) {
    const target = event.target;
    if (target instanceof HTMLElement && target.closest('.dropdown-wrapper')) {
      return;
    }

    this.showNotificationsMenu = false;
    this.showAccountMenu = false;
  }
  
/*
  toggleNotifications(event: MouseEvent) {
    event.stopPropagation();
    this.showNotificationsMenu = !this.showNotificationsMenu;
    if (this.showNotificationsMenu) {
      this.showAccountMenu = false;
    }
  }
  */
 /* 
  toggleAccount(event: MouseEvent) {
    event.stopPropagation();
    this.showAccountMenu = !this.showAccountMenu;
    if (this.showAccountMenu) {
      this.showNotificationsMenu = false;
    }
  }

  markAllRead(event: MouseEvent) {
    event.stopPropagation();
    this.showNotificationsMenu = false;
  }
  
  
  goToNotifications() {
    this.showNotificationsMenu = false;
    this.router.navigate(['/farmer/settings/notifications']);
  }
  
  */
  goToProfile() {
    this.showAccountMenu = false;
    this.router.navigate(['/farmer/profile']);
  }
  /*
  goToSettings() {
    this.showAccountMenu = false;
    this.router.navigate(['/farmer/settings']);
  }
  
  goToHelpCenter() {
    this.showAccountMenu = false;
  }
  

  logout() {
    this.showAccountMenu = false;
    this._AuthService.logout();
  }
  */
}
