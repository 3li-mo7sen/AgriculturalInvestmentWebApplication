import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecentInvestmentItem } from '../../../../../../models/investor-dashboard';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-invest-dash-investments',
  imports: [CommonModule,RouterLink],
  templateUrl: './invest-dash-investments.html',
  styleUrls: ['./invest-dash-investments.css'],
})
export class InvestDashInvestments {
  @Input() investments: RecentInvestmentItem[] = [];
}
