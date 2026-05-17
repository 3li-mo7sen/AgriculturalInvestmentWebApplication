import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-farmer-nav',
  imports: [CommonModule,RouterLink],
  templateUrl: './farmer-nav.html',
  styleUrls: ['./farmer-nav.css'],
})
export class FarmerNav {
  pageTitle = 'Dashboard';
  pageSubtitle = "Welcome back, Ahmed! Here's your farming overview.";
  showNotificationsMenu = false;
  showAccountMenu = false;

  private router = inject(Router);

  private readonly pageMap = new Map<string, { title: string; subtitle: string }>([
    ['dashboard', { title: 'Dashboard', subtitle: "Welcome back, Ahmed! Here's your farming overview." }],
    ['create-project', { title: 'Create New Project', subtitle: 'Register your agricultural land for investment' }],
    ['my-projects', { title: 'My Projects', subtitle: 'Manage your agricultural investment projects' }],
    ['wallet', { title: 'Wallet', subtitle: 'Manage your funds and transactions' }],
    ['contracts', { title: 'Contracts', subtitle: 'Manage your investment contracts' }],
    ['settings', { title: 'Settings', subtitle: 'Manage your account preferences' }],
  ]);

  constructor(private _AuthService:AuthService) {
    this.updateHeader(this.router.url);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateHeader(event.urlAfterRedirects);
      }
    });
  }

  private updateHeader(url: string) {
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

  @HostListener('document:click')
  closeMenus() {
    this.showNotificationsMenu = false;
    this.showAccountMenu = false;
  }

  markAllRead(event: MouseEvent) {
    event.stopPropagation();
    this.showNotificationsMenu = false;
  }

  
  goToProfile() {
    this.showAccountMenu = false;
    this.router.navigate(['/farmer/settings/profile']);
  }

  


  logout() {
    this.showAccountMenu = false;

    this._AuthService.logout();
  }
}
