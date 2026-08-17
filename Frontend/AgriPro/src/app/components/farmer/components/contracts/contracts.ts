import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ContractCards } from './components/contract-cards/contract-cards';
import { ContractList } from './components/contract-list/contract-list';
import { ConSearch } from './components/con-search/con-search';
import { FarmerService } from '../../../../services/farmerService/farmer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contracts',
  imports: [ContractCards,ContractList,ConSearch,CommonModule],
  templateUrl: './contracts.html',
  styleUrls: ['./contracts.css'],
})
export class Contracts implements OnInit {
  contracts: any[] = [];
  filteredContracts: any[] = [];
  isLoading: boolean = true;

  searchTerm: string = '';
  selectedStatus: string = 'All Status';

  constructor(private farmerService: FarmerService,
              private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.farmerService.getContracts().subscribe({
      next: (contracts) => {
        this.contracts = contracts || [];
        this.applyFilter();
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading contracts', err);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.applyFilter();
  }

  onStatusChange(status: string) {
    this.selectedStatus = status;
    this.applyFilter();
  }

  applyFilter() {
    this.filteredContracts = this.contracts.filter(contract => {
      const matchesSearch = !this.searchTerm ||
        contract.contractNumber?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contract.projectName?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.selectedStatus === 'All Status' ||
        contract.status?.toLowerCase() === this.selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }

}
