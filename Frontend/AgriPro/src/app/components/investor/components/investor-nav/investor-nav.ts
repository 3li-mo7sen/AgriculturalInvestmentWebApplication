import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';

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

  private router = inject(Router);

  private readonly pageMap = new Map<string, { title: string; subtitle: string }>([
    ['dashboard', { title: 'Dashboard', subtitle: 'Track your agricultural investments and returns' }],
    ['available-projects', { title: 'Available Projects', subtitle: 'Browse and invest in verified agricultural projects' }],
    ['my-investments', { title: 'My Investments', subtitle: 'Track and manage your agricultural investments' }],
    ['investment-history', { title: 'Investment History', subtitle: 'View your complete investment transaction history' }],
    ['wallet', { title: 'Wallet', subtitle: 'Manage your investment funds' }],
    ['settings', { title: 'My Profile', subtitle: 'Manage your account preferences' }],
  ]);

  constructor() {
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
