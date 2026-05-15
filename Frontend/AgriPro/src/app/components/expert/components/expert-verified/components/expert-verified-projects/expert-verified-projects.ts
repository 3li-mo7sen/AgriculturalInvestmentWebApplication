import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-expert-verified-projects',
  imports: [CommonModule],
  templateUrl: './expert-verified-projects.html',
  styleUrls: ['./expert-verified-projects.css'],
})
export class ExpertVerifiedProjects {
  projects = [
    {
      title: 'Wheat Farm Investment',
      category: 'Wheat',
      location: 'Kafr El-Sheikh, Beheira',
      farmer: 'Ahmed Hassan',
      verifiedDate: 'Jan 14, 2024',
      progress: 75,
      investors: 12,
      roi: '15-18%',
    },
    {
      title: 'Organic Vegetable Farm',
      category: 'Vegetables',
      location: 'Tamiya, Fayoum',
      farmer: 'Fatma El-Sayed',
      verifiedDate: 'Jan 10, 2024',
      progress: 100,
      investors: 18,
      roi: '12-15%',
    },
    {
      title: 'Rice Paddy Investment',
      category: 'Rice',
      location: 'Desouk, Kafr El-Sheikh',
      farmer: 'Omar Mostafa',
      verifiedDate: 'Jan 05, 2024',
      progress: 45,
      investors: 8,
      roi: '16-20%',
    },
  ];
}
