import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FarmerNav } from './components/farmer-nav/farmer-nav';

@Component({
  selector: 'app-farmer',
  imports: [CommonModule,RouterLink,RouterOutlet,RouterLinkActive,FarmerNav],
  templateUrl: './farmer.html',
  styleUrl: './farmer.css',
})
export class Farmer {
  isCollapsed: boolean = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    // كود الخروج هنا (مثلاً نمسح الـ Token ونرجع لصفحة Login)
    console.log('User logged out');
  }

}
