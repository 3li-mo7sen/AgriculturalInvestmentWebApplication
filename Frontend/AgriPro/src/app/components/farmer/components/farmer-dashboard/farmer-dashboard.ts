import { Component, OnInit } from '@angular/core';
import { StatsCards } from './components/stats-cards/stats-cards';
import { RecentProjects } from './components/recent-projects/recent-projects';
import { FarmerService } from '../../../../services/farmerService/farmer.service';
import { ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-farmer-dashboard',
  imports: [StatsCards, RecentProjects,RouterLink ,CommonModule],
  templateUrl: './farmer-dashboard.html',
  styleUrls: ['./farmer-dashboard.css'],
})
export class FarmerDashboard implements OnInit{
  dashboardData: any = null;
  isLoading: boolean = true;
  constructor(
    private _farmerService: FarmerService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this._farmerService.getDashboardData().subscribe({
      next: (res) => {
        this.dashboardData = res;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Dashboard Error:', err);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

}
