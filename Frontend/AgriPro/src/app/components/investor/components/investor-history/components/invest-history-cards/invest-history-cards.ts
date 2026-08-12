import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestmentHistoryResponse } from '../../../../../../models/investor-history';

@Component({
  selector: 'app-invest-history-cards',
  imports: [CommonModule],
  templateUrl: './invest-history-cards.html',
  styleUrls: ['./invest-history-cards.css'],
  standalone: true
})
export class InvestHistoryCards{
  @Input() summaryData: InvestmentHistoryResponse | null = null;

  cards: Array<{ title: string; value: string; icon: string }> = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (this.summaryData) {
      const totalInvested = this.summaryData.totalInvested ?? 0;
      const totalProfit = this.summaryData.totalProfit ?? 0;
      const activeInvestments = this.summaryData.activeInvestments ?? 0;
      const completedInvestments = this.summaryData.completedInvestments ?? 0;

      this.cards = [
        {
          title: 'Total Invested',
          value: `EGP ${totalInvested.toLocaleString()}`,
          icon: '$'
        },
        {
          title: 'Total Profit',
          value: `EGP ${totalProfit.toLocaleString()}`,
          icon: '📈'
        },
        {
          title: 'Active Investments',
          value: `${activeInvestments}`,
          icon: '📋'
        },
        {
          title: 'Completed',
          value: `${completedInvestments}`,
          icon: '✅'
        }
      ];
    }
  }
}
