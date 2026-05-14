import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { InvestorNav } from './components/investor-nav/investor-nav';

@Component({
  selector: 'app-investor',
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive, InvestorNav],
  templateUrl: './investor.html',
  styleUrls: ['./investor.css'],
})
export class Investor {
  isCollapsed: boolean = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    console.log('User logged out');
  }
}