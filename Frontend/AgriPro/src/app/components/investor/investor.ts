import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { InvestorNav } from './components/investor-nav/investor-nav';

@Component({
  selector: 'app-investor',
  imports: [CommonModule,RouterLink,RouterOutlet,RouterLinkActive,InvestorNav],
  templateUrl: './investor.html',
  styleUrl: './investor.css',
})
export class Investor {
  isCollapsed: boolean = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    // كود الخروج هنا (مثلاً نمسح الـ Token ونرجع لصفحة Login)
    console.log('User logged out');
  }

}
