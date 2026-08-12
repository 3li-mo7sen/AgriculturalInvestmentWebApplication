import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Investment } from '../../../../../../models/investor-my-investments';

@Component({
  selector: 'app-invest-investments-cards',
  imports: [CommonModule],
  templateUrl: './invest-investments-cards.html',
  styleUrls: ['./invest-investments-cards.css'],
})
export class InvestInvestmentsCards {
  @Input() investments: Investment[] = [];

  totalInvested: number = 0;
  expectedReturns: number = 0;
  activeInvestmentsCount: number = 0;
  totalProjectsCount: number = 0;

  ngOnChanges(): void {
    this.calculateStats();
  }

  calculateStats(): void {
    this.totalProjectsCount = this.investments.length;
    this.totalInvested = this.investments.reduce((sum, item) => sum + (item.amount || 0), 0);
    this.expectedReturns = this.investments.reduce((sum, item) => sum + (item.expectedReturn || 0), 0);
    this.activeInvestmentsCount = this.investments.filter(
      item => item.status?.toLowerCase() === 'active'
    ).length;
  }
}
