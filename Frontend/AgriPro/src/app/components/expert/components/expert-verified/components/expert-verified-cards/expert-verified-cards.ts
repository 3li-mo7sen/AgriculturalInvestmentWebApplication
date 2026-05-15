import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-expert-verified-cards',
  imports: [CommonModule],
  templateUrl: './expert-verified-cards.html',
  styleUrls: ['./expert-verified-cards.css'],
})
export class ExpertVerifiedCards {
  cards = [
    { label: 'Total Verified', value: '6', icon: 'fa-solid fa-circle-check' },
    { label: 'Total Funding', value: 'EGP 1.8M', icon: 'fa-solid fa-arrow-trend-up' },
    { label: 'Total Investors', value: '85', icon: 'fa-solid fa-user-group' },
  ];
}
