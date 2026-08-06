import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-wallet-cards',
  imports: [CommonModule],
  templateUrl: './wallet-cards.html',
  styleUrls: ['./wallet-cards.css'],
})
export class WalletCards {
  @Input() balance: number = 0;
  @Input() totalRaised: number = 0;
  @Input() totalReturns: number = 0;
  @Input() pendingReturns: number = 0;

}
