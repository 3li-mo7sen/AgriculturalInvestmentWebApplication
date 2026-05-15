import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-expert-nav',
  imports: [CommonModule],
  templateUrl: './expert-nav.html',
  styleUrls: ['./expert-nav.css'],
})
export class ExpertNav {
  userName = 'Ahmed Hassan';
  notificationCount = 2;
  showNotificationsMenu = false;
  showAccountMenu = false;
  pageTitle = 'Settings';
  pageSubtitle = 'Manage your account preferences';

  private titleMap: Record<string, { title: string; subtitle: string }> = {
    '/expert/dashboard': { title: 'Dashboard', subtitle: 'Overview of your activity' },
    '/expert/pending-reviews': { title: 'Pending Reviews', subtitle: 'Review new requests' },
    '/expert/verified-projects': { title: 'Verified Projects', subtitle: 'Projects you approved' },
    '/expert/rejected-projects': { title: 'Rejected Projects', subtitle: 'Projects that were rejected' },
    '/expert/settings': { title: 'Settings', subtitle: 'Manage your account preferences' },
    '/expert/settings/profile': { title: 'Profile', subtitle: 'Update your personal information' },
    '/expert/settings/security': { title: 'Security', subtitle: 'Manage passwords and access' },
    '/expert/settings/notifications': { title: 'Notifications', subtitle: 'Control your alerts and updates' },
    '/expert/settings/preferences': { title: 'Preferences', subtitle: 'Set your personal preferences' }
  };

  constructor(private router: Router) {
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(event => {
      this.updatePageHeader(event.urlAfterRedirects || event.url);
    });
    this.updatePageHeader(this.router.url);
  }

  private updatePageHeader(url: string): void {
    const path = url.split('?')[0].split('#')[0];
    const bestMatch = this.getBestMatch(path);
    this.pageTitle = bestMatch.title;
    this.pageSubtitle = bestMatch.subtitle;
  }

  private getBestMatch(path: string): { title: string; subtitle: string } {
    if (this.titleMap[path]) {
      return this.titleMap[path];
    }

    const segments = path.split('/');
    if (segments.length >= 3) {
      const parent = `/${segments.slice(0, 3).join('/')}`;
      if (this.titleMap[parent]) {
        return this.titleMap[parent];
      }
    }

    return this.titleMap['/expert/settings'];
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
    this.router.navigate(['/expert/settings/notifications']);
  }

  goToProfile() {
    this.showAccountMenu = false;
    this.router.navigate(['/expert/settings/profile']);
  }

  goToSettings() {
    this.showAccountMenu = false;
    this.router.navigate(['/expert/settings']);
  }

  goToHelpCenter() {
    this.showAccountMenu = false;
  }

  logout() {
    this.showAccountMenu = false;
    this.router.navigate(['/login']);
  }
}
