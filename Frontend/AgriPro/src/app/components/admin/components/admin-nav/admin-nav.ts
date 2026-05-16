import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';

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

  private router = inject(Router);

  private readonly pageMap = new Map<string, { title: string; subtitle: string }>([
    ['dashboard', { title: 'Dashboard', subtitle: "Welcome back, Admin! Here's your admin overview." }],
    ['manage-accounts', { title: 'Manage Accounts', subtitle: 'Manage user accounts and roles' }],
    ['approve-documents', { title: 'Approve Documents', subtitle: 'Review and approve user documents' }],
    ['reports', { title: 'Reports', subtitle: 'View system reports and alerts' }],
    ['settings', { title: 'Settings', subtitle: 'Manage admin preferences' }],
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

  @HostListener('document:click')
  closeMenus() {
    this.showNotificationsMenu = false;
    this.showAccountMenu = false;
  }

  markAllRead(event: MouseEvent) {
    event.stopPropagation();
    this.showNotificationsMenu = false;
  }

  goToNotifications() {
    this.showNotificationsMenu = false;
    this.router.navigate(['/admin/settings/notifications']);
  }

  goToProfile() {
    this.showAccountMenu = false;
    this.router.navigate(['/admin/settings/profile']);
  }

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
}
