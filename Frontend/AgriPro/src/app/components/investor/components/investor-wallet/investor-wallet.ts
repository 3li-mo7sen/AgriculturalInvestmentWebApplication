import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestWalletBank } from './components/invest-wallet-bank/invest-wallet-bank';
import { InvestWalletCards } from './components/invest-wallet-cards/invest-wallet-cards';
import { InvestWalletQuick } from './components/invest-wallet-quick/invest-wallet-quick';
import { InvestWalletTip } from './components/invest-wallet-tip/invest-wallet-tip';
import { InvestWalletTransactions } from './components/invest-wallet-transactions/invest-wallet-transactions';
import { InvestorWalletResponse } from '../../../../models/investor-wallet';
import { InvestorService } from '../../../../services/investorService/investor.service';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-investor-wallet',
  imports: [CommonModule, InvestWalletCards, InvestWalletQuick, InvestWalletBank, InvestWalletTip, InvestWalletTransactions],
  templateUrl: './investor-wallet.html',
  styleUrls: ['./investor-wallet.css'],
})
export class InvestorWallet {
  walletData: InvestorWalletResponse | null = null;
  isLoading = true;
  errorMessage = '';

  showAddFundsModal = false;
  showWithdrawModal = false;

  constructor(
    private investorService: InvestorService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchWalletData();
  }

  fetchWalletData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.investorService.getWalletData()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (data) => {
          this.walletData = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading wallet data:', err);
          this.errorMessage = 'Failed to load wallet data.';
          this.cdr.detectChanges();
        }
      });
  }

  openAddFunds() {
    this.showAddFundsModal = true;
    this.showWithdrawModal = false;
  }

  openWithdraw() {
    this.showWithdrawModal = true;
    this.showAddFundsModal = false;
  }

  closeModal() {
    this.showAddFundsModal = false;
    this.showWithdrawModal = false;
  }
}
