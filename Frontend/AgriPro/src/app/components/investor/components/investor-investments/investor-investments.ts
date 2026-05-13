import { Component } from '@angular/core';
import { InvestInvestmentsCards } from './components/invest-investments-cards/invest-investments-cards';
import { InvestInvestmentsProjects } from './components/invest-investments-projects/invest-investments-projects';
import { InvestInvestmentsSearch } from './components/invest-investments-search/invest-investments-search';

@Component({
  selector: 'app-investor-investments',
  imports: [InvestInvestmentsCards,InvestInvestmentsProjects,InvestInvestmentsSearch],
  templateUrl: './investor-investments.html',
  styleUrl: './investor-investments.css',
})
export class InvestorInvestments {

}
