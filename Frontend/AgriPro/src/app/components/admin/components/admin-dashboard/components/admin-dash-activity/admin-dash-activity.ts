import { Component, Input } from '@angular/core';
import { RecentActivityItem } from '../../../../../../models/admin-dashboard';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dash-activity',
  imports:[CommonModule],
  templateUrl: './admin-dash-activity.html',
  styleUrls: ['./admin-dash-activity.css']
})
export class AdminDashActivity {
  @Input() activities: RecentActivityItem[] = [];
}
