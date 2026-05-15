import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { InvestorNav } from './components/investor-nav/investor-nav';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-investor',
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive, InvestorNav],
  templateUrl: './investor.html',
  styleUrls: ['./investor.css'],
})
export class Investor {
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