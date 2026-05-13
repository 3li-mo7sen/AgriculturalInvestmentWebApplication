import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-farmer-nav',
  imports: [],
  templateUrl: './farmer-nav.html',
  styleUrls: ['./farmer-nav.css'],
})
export class FarmerNav {
  pageTitle = 'Dashboard';
  pageSubtitle = "Welcome back, Ahmed! Here's your farming overview.";

  private router = inject(Router);

  private readonly pageMap = new Map<string, { title: string; subtitle: string }>([
    ['dashboard', { title: 'Dashboard', subtitle: "Welcome back, Ahmed! Here's your farming overview." }],
    ['create-project', { title: 'Create New Project', subtitle: 'Register your agricultural land for investment' }],
    ['my-projects', { title: 'My Projects', subtitle: 'Manage your agricultural investment projects' }],
    ['wallet', { title: 'Wallet', subtitle: 'Manage your funds and transactions' }],
    ['contracts', { title: 'Contracts', subtitle: 'Manage your investment contracts' }],
    ['settings', { title: 'Settings', subtitle: 'Manage your account preferences' }],
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
}
