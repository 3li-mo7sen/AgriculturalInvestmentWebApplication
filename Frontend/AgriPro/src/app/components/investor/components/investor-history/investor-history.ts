import { ChangeDetectorRef, Component } from '@angular/core';
import { InvestHistoryCards } from './components/invest-history-cards/invest-history-cards';
import { InvestHistoryList } from './components/invest-history-list/invest-history-list';
import { InvestHistorySearch } from './components/invest-history-search/invest-history-search';
import { CommonModule } from '@angular/common';
import { HistoryItem, InvestmentHistoryResponse } from '../../../../models/investor-history';
import { InvestorService } from '../../../../services/investorService/investor.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-investor-history',
  standalone: true,
  imports: [InvestHistoryCards, InvestHistoryList, InvestHistorySearch,CommonModule],
  templateUrl: './investor-history.html',
  styleUrls: ['./investor-history.css'],
})
export class InvestorHistory {
  historyData: InvestmentHistoryResponse | null = null;
  filteredHistory: HistoryItem[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  searchQuery: string = '';
  selectedStatus: string = 'All Status';

  constructor(
    private investorService: InvestorService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchHistory();
  }

  fetchHistory(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.investorService.getInvestmentHistory()
      .pipe(
        finalize(() => {

          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (data) => {
          if (data) {
            this.historyData = data;
            this.applyFilter();
          } else {
            this.historyData = null;
            this.filteredHistory = [];
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching history:', err);
          if (err.status === 401) {
            this.errorMessage = 'Session expired. Please log in again.';
          } else {
            this.errorMessage = 'Failed to load investment history. Please check your connection.';
          }
          this.cdr.detectChanges();
        }
      });
  }

  onSearchChange(query: string): void {
    this.searchQuery = query || '';
    this.applyFilter();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status || 'All Status';
    this.applyFilter();
  }

  applyFilter(): void {
    if (!this.historyData || !Array.isArray(this.historyData.history)) {
      this.filteredHistory = [];
      return;
    }

    this.filteredHistory = this.historyData.history.filter(item => {
      if (!item) return false;
      const projectName = item.projectName ? item.projectName.toLowerCase() : '';
      const status = item.status ? item.status.toLowerCase() : '';

      const matchesSearch = !this.searchQuery || projectName.includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.selectedStatus === 'All Status' || status === this.selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }
}
