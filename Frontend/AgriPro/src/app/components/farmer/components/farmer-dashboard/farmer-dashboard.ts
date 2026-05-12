import { Component } from '@angular/core';
import { StatsCards } from './components/stats-cards/stats-cards';
import { RecentProjects } from './components/recent-projects/recent-projects';

@Component({
  selector: 'app-farmer-dashboard',
  imports: [StatsCards,RecentProjects],
  templateUrl: './farmer-dashboard.html',
  styleUrl: './farmer-dashboard.css',
})
export class FarmerDashboard {

}
