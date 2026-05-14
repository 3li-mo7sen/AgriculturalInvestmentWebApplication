import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestWalletBank } from './components/invest-wallet-bank/invest-wallet-bank';
import { InvestWalletCards } from './components/invest-wallet-cards/invest-wallet-cards';
import { InvestWalletQuick } from './components/invest-wallet-quick/invest-wallet-quick';
import { InvestWalletTip } from './components/invest-wallet-tip/invest-wallet-tip';
import { InvestWalletTransactions } from './components/invest-wallet-transactions/invest-wallet-transactions';

@Component({
  standalone: true,
  selector: 'app-investor-wallet',
  imports: [CommonModule, InvestWalletCards, InvestWalletQuick, InvestWalletBank, InvestWalletTip, InvestWalletTransactions],
  templateUrl: './investor-wallet.html',
  styleUrls: ['./investor-wallet.css'],
})
export class InvestorWallet {
  showAddFundsModal = false;
  showWithdrawModal = false;

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
