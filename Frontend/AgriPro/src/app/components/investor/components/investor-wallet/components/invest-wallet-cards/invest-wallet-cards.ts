import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-invest-wallet-cards',
  imports: [CommonModule],
  templateUrl: './invest-wallet-cards.html',
  styleUrls: ['./invest-wallet-cards.css'],
})
export class InvestWalletCards {
  @Input() balance: number = 0;
  @Input() totalInvested: number = 0;
  @Input() totalReturns: number = 0;
}
