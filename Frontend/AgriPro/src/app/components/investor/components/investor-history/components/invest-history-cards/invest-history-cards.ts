import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invest-history-cards',
  imports: [CommonModule],
  templateUrl: './invest-history-cards.html',
  styleUrl: './invest-history-cards.css',
  standalone: true
})
export class InvestHistoryCards {
  cards = [
    {
      title: 'Total Invested',
      value: 'EGP 380,000',
      icon: '$'
    },
    {
      title: 'Total Returns',
      value: 'EGP 127,200',
      icon: '📈'
    },
    {
      title: 'Transactions',
      value: '6',
      icon: '📋'
    },
    {
      title: 'Average ROI',
      value: '18.2%',
      icon: '📈'
    }
  ];
}
