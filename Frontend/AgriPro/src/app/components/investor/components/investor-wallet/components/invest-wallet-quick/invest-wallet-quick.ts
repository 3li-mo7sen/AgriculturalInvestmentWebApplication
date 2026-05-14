import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-invest-wallet-quick',
  imports: [],
  templateUrl: './invest-wallet-quick.html',
  styleUrls: ['./invest-wallet-quick.css'],
})
export class InvestWalletQuick {
  @Output() addFunds = new EventEmitter<void>();
  @Output() withdrawEarnings = new EventEmitter<void>();
}
