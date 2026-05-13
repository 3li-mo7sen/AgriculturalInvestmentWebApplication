import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FarmerNav } from './components/farmer-nav/farmer-nav';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-farmer',
  imports: [CommonModule,RouterLink,RouterOutlet,RouterLinkActive,FarmerNav],
  templateUrl: './farmer.html',
  styleUrl: './farmer.css',
})
export class Farmer {
  isCollapsed: boolean = false;

  constructor(private _AuthService:AuthService) { }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this._AuthService.logout();
    console.log('User logged out');
  }

}
