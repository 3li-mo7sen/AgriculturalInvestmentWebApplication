import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { WalletTransaction } from '../../../../../../models/investor-wallet';

@Component({
  selector: 'app-invest-wallet-transactions',
  imports: [CommonModule],
  templateUrl: './invest-wallet-transactions.html',
  styleUrls: ['./invest-wallet-transactions.css'],
})
export class InvestWalletTransactions {
  @Input() transactions: WalletTransaction[] = [];
}
