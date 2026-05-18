import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { FarmerService } from '../../../../services/farmerService/farmer.service';

@Component({
  standalone: true,
  selector: 'app-farmer-nav',
  imports: [CommonModule,RouterLink],
  templateUrl: './farmer-nav.html',
  styleUrls: ['./farmer-nav.css'],
})
export class FarmerNav {
  userName = 'Farmer';
  pageTitle = 'Dashboard';
  pageSubtitle = "Welcome back, Ahmed! Here's your farming overview.";
  showNotificationsMenu = false;
  showAccountMenu = false;

  private router = inject(Router);

  private readonly pageMap = new Map<string, { title: string; subtitle: string }>([
    ['dashboard', { title: 'Dashboard', subtitle: "" }], // سيبي الـ subtitle فاضي هنا
    ['create-project', { title: 'Create New Project', subtitle: 'Register your agricultural land for investment' }],
    ['my-projects', { title: 'My Projects', subtitle: 'Manage your agricultural investment projects' }],
    ['wallet', { title: 'Wallet', subtitle: 'Manage your funds and transactions' }],
    ['contracts', { title: 'Contracts', subtitle: 'Manage your investment contracts' }],
    ['profile', { title: 'My Profile', subtitle: 'Manage your farmer profile and account details' }],
    ['settings', { title: 'Settings', subtitle: 'Manage your account preferences' }],
  ]);

  constructor(private _AuthService: AuthService, private _Router: Router,private _FarmerService:FarmerService) {
    this.getUserData();
    this.updateHeader(this.router.url);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateHeader(event.urlAfterRedirects);
      }
    });
  }
  getUserData() {
    this._FarmerService.getDashboardData().subscribe({
      next: (res: any) => {
        if (res && res.user) {
          this.userName = res.user.name;
          // نحدث الهيدر تاني عشان يشيل "Farmer" ويحط الاسم الحقيقي
          this.updateHeader(this.router.url);
        }
      },
      error: (err) => console.error('Error fetching user data', err)
    });
  }

  private updateHeader(url: string) {
    const segments = url.split('/').filter(Boolean);
    const pageKey = segments.length ? segments[segments.length - 1] : 'dashboard';
    const effectiveKey = ['security', 'notifications', 'preferences'].includes(pageKey) ? 'settings' : pageKey;

    const config = this.pageMap.get(effectiveKey) ?? this.pageMap.get('dashboard');

    this.pageTitle = config?.title ?? 'Dashboard';

    // لو إحنا في الداشبورد، استخدمي الاسم اللي جاي من السيرفر
    if (effectiveKey === 'dashboard') {
      this.pageSubtitle = `Welcome back, ${this.userName}! Here's your farming overview.`;
    } else {
      this.pageSubtitle = config?.subtitle ?? '';
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

  goToNotifications(event?: MouseEvent) { // ضيفي event هنا
    if (event) event.stopPropagation();
    this.showNotificationsMenu = false;
    this.router.navigate(['/farmer/settings/notifications']);
  }
  // ميثود فتح قفل قائمة الإشعارات
  toggleNotifications(event: MouseEvent) {
    event.stopPropagation();
    this.showNotificationsMenu = !this.showNotificationsMenu;
    if (this.showNotificationsMenu) {
      this.showAccountMenu = false;
    }
  }

  // ميثود فتح وقفل قائمة الحساب (اللي فيها الإيرور)
  toggleAccount(event: MouseEvent) {
    event.stopPropagation();
    this.showAccountMenu = !this.showAccountMenu;
    if (this.showAccountMenu) {
      this.showNotificationsMenu = false;
    }
  }

  goToProfile() {
    this.showAccountMenu = false;
    this.router.navigate(['/farmer/settings/profile']);
  }

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
}
