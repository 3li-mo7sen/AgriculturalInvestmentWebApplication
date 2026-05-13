import { Component } from '@angular/core';
import { InvestDashCards } from './components/invest-dash-cards/invest-dash-cards';
import { InvestDashInvestments } from './components/invest-dash-investments/invest-dash-investments';
import { InvestDashProjects } from './components/invest-dash-projects/invest-dash-projects';

@Component({
  selector: 'app-investor-dashboard',
  imports: [InvestDashCards,InvestDashInvestments,InvestDashProjects],
  templateUrl: './investor-dashboard.html',
  styleUrl: './investor-dashboard.css',
})
export class InvestorDashboard {

}
