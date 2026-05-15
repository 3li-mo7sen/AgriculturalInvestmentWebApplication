import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Review {
  id: number;
  projectName: string;
  location: string;
  priority: 'High' | 'Medium' | 'Low';
  submittedBy: string;
  submittedTime: string;
  feddan: number;
  cropType: string;
  docs: number;
  images: number;
}

@Component({
  standalone: true,
  selector: 'app-expert-dash-reviews',
  imports: [CommonModule],
  templateUrl: './expert-dash-reviews.html',
  styleUrl: './expert-dash-reviews.css',
})
export class ExpertDashReviews {
  reviews: Review[] = [
    {
      id: 1,
      projectName: 'Wheat Farm',
      location: 'Beheira',
      priority: 'High',
      submittedBy: 'Ahmed Hassan',
      submittedTime: '2 hours ago',
      feddan: 15,
      cropType: 'Wheat',
      docs: 4,
      images: 6
    },
    {
      id: 2,
      projectName: 'Mango Orchard',
      location: 'Ismailia',
      priority: 'Medium',
      submittedBy: 'Mohamed Ali',
      submittedTime: '5 hours ago',
      feddan: 8,
      cropType: 'Fruits',
      docs: 3,
      images: 8
    },
    {
      id: 3,
      projectName: 'Rice Paddy',
      location: 'Kafr El-Sheikh',
      priority: 'Low',
      submittedBy: 'Omar Mostafa',
      submittedTime: '1 day ago',
      feddan: 12,
      cropType: 'Rice',
      docs: 5,
      images: 4
    },
    {
      id: 4,
      projectName: 'Cotton Plantation',
      location: 'Minya',
      priority: 'Medium',
      submittedBy: 'Youssef Ibrahim',
      submittedTime: '1 day ago',
      feddan: 20,
      cropType: 'Cotton',
      docs: 4,
      images: 7
    }
  ];

  getPriorityClass(priority: string): string {
    switch(priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  }
}
