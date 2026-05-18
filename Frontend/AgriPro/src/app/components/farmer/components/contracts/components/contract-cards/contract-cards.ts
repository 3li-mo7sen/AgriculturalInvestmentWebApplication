import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-contract-cards',
  imports: [],
  templateUrl: './contract-cards.html',
  styleUrls: ['./contract-cards.css'],
})
export class ContractCards {
  @Input() contracts: any[] = [];

  get activeCount(): number {
    return this.contracts.filter((contract) => contract.status === 'Active').length;
  }

  get completedCount(): number {
    return this.contracts.filter((contract) => contract.status === 'Completed').length;
  }

}
