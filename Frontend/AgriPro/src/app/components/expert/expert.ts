import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ExpertNav } from './components/expert-nav/expert-nav';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-expert',
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive, ExpertNav],
  templateUrl: './expert.html',
  styleUrls: ['./expert.css'],
})
export class Expert {
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
