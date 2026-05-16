import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface ExpertCard {
  title: string;
  value: string;
  meta: string;
  icon: string;
  iconClass: string;
}

@Component({
  standalone: true,
  selector: 'app-expert-dash-cards',
  imports: [CommonModule],
  templateUrl: './expert-dash-cards.html',
  styleUrls: ['./expert-dash-cards.css'],
})
export class ExpertDashCards {
  cards: ExpertCard[] = [
    {
      title: 'Pending Reviews',
      value: '8',
      meta: '3 urgent',
      icon: 'fa-regular fa-clock',
      iconClass: 'icon-warning'
    },
    {
      title: 'Verified This Month',
      value: '24',
      meta: '+6 from last month',
      icon: 'fa-regular fa-circle-check',
      iconClass: 'icon-success'
    },
    {
      title: 'Rejected This Month',
      value: '3',
      meta: '12% rejection rate',
      icon: 'fa-regular fa-circle-xmark',
      iconClass: 'icon-danger'
    },
    {
      title: 'In Progress',
      value: '5',
      meta: 'Currently reviewing',
      icon: 'fa-regular fa-clipboard',
      iconClass: 'icon-info'
    }
  ];
}
