import { Component } from '@angular/core';
import { InvestHistoryCards } from './components/invest-history-cards/invest-history-cards';
import { InvestHistoryList } from './components/invest-history-list/invest-history-list';
import { InvestHistorySearch } from './components/invest-history-search/invest-history-search';

@Component({
  selector: 'app-investor-history',
  standalone: true,
  imports: [InvestHistoryCards, InvestHistoryList, InvestHistorySearch],
  templateUrl: './investor-history.html',
  styleUrls: ['./investor-history.css'],
})
export class InvestorHistory {

}
