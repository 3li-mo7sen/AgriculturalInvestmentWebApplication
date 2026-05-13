import { Component } from '@angular/core';
import { Earnings } from './components/earnings/earnings';
import { LinkedBank } from './components/linked-bank/linked-bank';
import { QuickActions } from './components/quick-actions/quick-actions';
import { TransactionHistory } from './components/transaction-history/transaction-history';
import { WalletCards } from './components/wallet-cards/wallet-cards';

@Component({
  standalone: true,
  selector: 'app-wallet',
  imports: [Earnings, LinkedBank, QuickActions, TransactionHistory, WalletCards],
  templateUrl: './wallet.html',
  styleUrls: ['./wallet.css'],
})
export class Wallet {

}
