import { Component, OnInit } from '@angular/core';
import { ContractCards } from './components/contract-cards/contract-cards';
import { ContractList } from './components/contract-list/contract-list';
import { ConSearch } from './components/con-search/con-search';
import { FarmerService } from '../../../../services/farmerService/farmer.service';

@Component({
  selector: 'app-contracts',
  imports: [ContractCards,ContractList,ConSearch],
  templateUrl: './contracts.html',
  styleUrls: ['./contracts.css'],
})
export class Contracts implements OnInit {
  contracts: any[] = [];

  constructor(private farmerService: FarmerService) { }

  ngOnInit(): void {
    this.farmerService.getContracts().subscribe({
      next: (contracts) => {
        this.contracts = contracts;
      },
      error: (err) => console.error('Error loading contracts', err)
    });
  }

}
