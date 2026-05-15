import { Component } from '@angular/core';
import { AdminAccountsCards } from './components/admin-accounts-cards/admin-accounts-cards';
import { AdminAccountsList } from './components/admin-accounts-list/admin-accounts-list';

@Component({
  selector: 'app-admin-accounts',
  imports: [AdminAccountsCards,AdminAccountsList],
  templateUrl: './admin-accounts.html',
  styleUrl: './admin-accounts.css',
})
export class AdminAccounts {

}
