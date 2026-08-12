import { ChangeDetectorRef, Component } from '@angular/core';
import { InvestInvestmentsCards } from './components/invest-investments-cards/invest-investments-cards';
import { InvestInvestmentsProjects } from './components/invest-investments-projects/invest-investments-projects';
import { InvestInvestmentsSearch } from './components/invest-investments-search/invest-investments-search';
import { CommonModule } from '@angular/common';
import { Investment } from '../../../../models/investor-my-investments';
import { InvestorService } from '../../../../services/investorService/investor.service';

@Component({
  selector: 'app-investor-investments',
  imports: [InvestInvestmentsCards,InvestInvestmentsProjects,InvestInvestmentsSearch,CommonModule],
  templateUrl: './investor-investments.html',
  styleUrls: ['./investor-investments.css'],
})
export class InvestorInvestments {
  investments: Investment[] = [];
  filteredInvestments: Investment[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  searchQuery: string = '';
  selectedStatus: string = 'All Status';

  constructor(private investorService: InvestorService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.fetchInvestments();
  }

  fetchInvestments(): void {
    this.isLoading = true;
    this.investorService.getMyInvestments().subscribe({
      next: (data) => {
        this.investments = data;
        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching investments:', err);
        this.errorMessage = 'Failed to load investments.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.applyFilter();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilter();
  }

  applyFilter(): void {
    this.filteredInvestments = this.investments.filter(inv => {
      const matchesSearch = !this.searchQuery || inv.projectName.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.selectedStatus === 'All Status' || inv.status.toLowerCase() === this.selectedStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }
}
