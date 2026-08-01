import { Component, OnInit } from '@angular/core';
import { StatsCards } from './components/stats-cards/stats-cards';
import { RecentProjects } from './components/recent-projects/recent-projects';
import { FarmerService } from '../../../../services/farmerService/farmer.service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  standalone: true,
  selector: 'app-farmer-dashboard',
  imports: [StatsCards, RecentProjects],
  templateUrl: './farmer-dashboard.html',
  styleUrls: ['./farmer-dashboard.css'],
})
export class FarmerDashboard implements OnInit{
  dashboardData: any = null;

  constructor(private _farmerService: FarmerService,private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this._farmerService.getDashboardData().subscribe({
      next: (res) => {
        this.dashboardData = res; 
      },
      error: (err) => console.error(err)
    });
  }

}
