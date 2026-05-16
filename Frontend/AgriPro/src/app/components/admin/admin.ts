import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminNav } from './components/admin-nav/admin-nav';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive,AdminNav],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class Admin {
  isCollapsed: boolean = false;

  constructor(private _AuthService: AuthService) { }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this._AuthService.logout();
    console.log('User logged out');
  }

}
