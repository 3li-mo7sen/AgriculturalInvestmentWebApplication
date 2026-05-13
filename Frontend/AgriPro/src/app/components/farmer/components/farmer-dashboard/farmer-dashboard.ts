import { Component } from '@angular/core';
import { StatsCards } from './components/stats-cards/stats-cards';
import { RecentProjects } from './components/recent-projects/recent-projects';

@Component({
  standalone: true,
  selector: 'app-farmer-dashboard',
  imports: [StatsCards, RecentProjects],
  templateUrl: './farmer-dashboard.html',
  styleUrls: ['./farmer-dashboard.css'],
})
export class FarmerDashboard {

}
