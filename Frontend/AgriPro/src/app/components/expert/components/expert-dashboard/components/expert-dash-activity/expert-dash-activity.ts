import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Activity {
  id: number;
  projectName: string;
  location: string;
  submittedBy: string;
  status: 'verified' | 'rejected';
  statusMessage: string;
  icon: string;
}

@Component({
  standalone: true,
  selector: 'app-expert-dash-activity',
  imports: [CommonModule],
  templateUrl: './expert-dash-activity.html',
  styleUrl: './expert-dash-activity.css',
})
export class ExpertDashActivity {
  activities: Activity[] = [
    {
      id: 1,
      projectName: 'Organic Vegetables',
      location: 'Fayoum',
      submittedBy: 'Fatma El-Sayed',
      status: 'verified',
      statusMessage: 'Verified Today',
      icon: 'fa-circle-check'
    },
    {
      id: 2,
      projectName: 'Sugarcane Farm',
      location: 'Qena',
      submittedBy: 'Hassan Mohamed',
      status: 'verified',
      statusMessage: 'Verified Yesterday',
      icon: 'fa-circle-check'
    },
    {
      id: 3,
      projectName: 'Citrus Orchard',
      location: 'Sharqia',
      submittedBy: 'Ali Mahmoud',
      status: 'rejected',
      statusMessage: 'Rejected: Incomplete ownership documents',
      icon: 'fa-circle-xmark'
    }
  ];

  getStatusClass(status: string): string {
    return status === 'verified' ? 'status-success' : 'status-danger';
  }
}
