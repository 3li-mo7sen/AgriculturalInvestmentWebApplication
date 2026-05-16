import { Component } from '@angular/core';
import { ContractCards } from './components/contract-cards/contract-cards';
import { ContractList } from './components/contract-list/contract-list';
import { ConSearch } from './components/con-search/con-search';

@Component({
  selector: 'app-contracts',
  imports: [ContractCards,ContractList,ConSearch],
  templateUrl: './contracts.html',
  styleUrls: ['./contracts.css'],
})
export class Contracts {

}
