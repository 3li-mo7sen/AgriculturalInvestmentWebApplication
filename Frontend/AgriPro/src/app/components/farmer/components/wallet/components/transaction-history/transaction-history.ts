import { Component, Input } from '@angular/core';
import { FarmerWalletTransaction } from '../../../../../../models/farmer-wallet-transaction';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-transaction-history',
  imports: [CommonModule],
  templateUrl: './transaction-history.html',
  styleUrls: ['./transaction-history.css'],
})
export class TransactionHistory {
  @Input() transactions: FarmerWalletTransaction[] = [];

}
