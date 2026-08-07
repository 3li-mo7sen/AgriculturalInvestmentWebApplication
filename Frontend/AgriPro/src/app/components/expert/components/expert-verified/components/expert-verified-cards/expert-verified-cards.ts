import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryCard } from '../../../../../../models/expert-verified';

@Component({
  standalone: true,
  selector: 'app-expert-verified-cards',
  imports: [CommonModule],
  templateUrl: './expert-verified-cards.html',
  styleUrls: ['./expert-verified-cards.css'],
})
export class ExpertVerifiedCards {
  @Input() totalVerified = 0;
  @Input() totalFunding = 0;
  @Input() totalInvestors = 0;

  cards: SummaryCard[] = [];

  ngOnChanges(): void {
    this.cards = [
      {
        label: 'Total Verified',
        value: String(this.totalVerified),
        icon: 'fa-solid fa-circle-check',
      },
      {
        label: 'Total Funding',
        value: `EGP ${this.totalFunding.toLocaleString()}`,
        icon: 'fa-solid fa-arrow-trend-up',
      },
      {
        label: 'Total Investors',
        value: String(this.totalInvestors),
        icon: 'fa-solid fa-user-group',
      },
    ];
  }
}
