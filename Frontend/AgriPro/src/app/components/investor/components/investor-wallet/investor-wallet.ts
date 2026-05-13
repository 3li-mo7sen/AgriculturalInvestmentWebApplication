import { Component } from '@angular/core';
import { InvestWalletBank } from './components/invest-wallet-bank/invest-wallet-bank';
import { InvestWalletCards } from './components/invest-wallet-cards/invest-wallet-cards';
import { InvestWalletQuick } from './components/invest-wallet-quick/invest-wallet-quick';
import { InvestWalletTip } from './components/invest-wallet-tip/invest-wallet-tip';
import { InvestWalletTransactions } from './components/invest-wallet-transactions/invest-wallet-transactions';

@Component({
  selector: 'app-investor-wallet',
  imports: [InvestWalletBank,InvestWalletCards,InvestWalletQuick,InvestWalletTip,InvestWalletTransactions],
  templateUrl: './investor-wallet.html',
  styleUrl: './investor-wallet.css',
})
export class InvestorWallet {

}
