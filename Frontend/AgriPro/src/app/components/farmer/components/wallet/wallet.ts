import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Earnings } from './components/earnings/earnings';
import { LinkedBank } from './components/linked-bank/linked-bank';
import { QuickActions } from './components/quick-actions/quick-actions';
import { TransactionHistory } from './components/transaction-history/transaction-history';
import { WalletCards } from './components/wallet-cards/wallet-cards';
import { FarmerService } from '../../../../services/farmerService/farmer.service';
import { FarmerWalletData } from '../../../../models/farmer-wallet-data';

@Component({
  standalone: true,
  selector: 'app-wallet',
  imports: [CommonModule, Earnings, LinkedBank, QuickActions, TransactionHistory, WalletCards],
  templateUrl: './wallet.html',
  styleUrls: ['./wallet.css'],
})
export class Wallet {
  showWithdrawModal = false;
  walletData: FarmerWalletData | null = null;
  isLoading = true;

  constructor(private farmerService: FarmerService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.fetchWalletData();
  }

  fetchWalletData(): void {
    this.isLoading = true;
    this.farmerService.getWallet().subscribe({
      next: (data) => {
        this.walletData = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching wallet data:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openWithdraw() {
    this.showWithdrawModal = true;
  }

  closeModal() {
    this.showWithdrawModal = false;
  }
}
