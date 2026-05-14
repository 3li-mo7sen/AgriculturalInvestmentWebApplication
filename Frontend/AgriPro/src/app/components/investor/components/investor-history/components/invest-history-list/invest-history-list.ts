import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invest-history-list',
  imports: [CommonModule],
  templateUrl: './invest-history-list.html',
  styleUrl: './invest-history-list.css',
  standalone: true
})
export class InvestHistoryList {
  transactions = [
    {
      project: 'Wheat Farm - Beheira',
      type: 'Investment',
      typeClass: 'investment',
      amount: 'EGP 75,000',
      roi: '17%',
      date: 'Jan 16, 2024',
      status: 'Active',
      statusClass: 'active',
      payment: 'Verified',
      paymentClass: 'verified'
    },
    {
      project: 'Organic Vegetables - Fayoum',
      type: 'Return',
      typeClass: 'return',
      amount: 'EGP 57,000',
      roi: '14%',
      date: 'Apr 15, 2024',
      status: 'Completed',
      statusClass: 'completed',
      payment: 'Verified',
      paymentClass: 'verified'
    },
    {
      project: 'Mango Orchard - Ismailia',
      type: 'Investment',
      typeClass: 'investment',
      amount: 'EGP 100,000',
      roi: '22%',
      date: 'Jan 20, 2024',
      status: 'Pending',
      statusClass: 'pending',
      payment: 'Pending',
      paymentClass: 'pending'
    },
    {
      project: 'Cotton Plantation - Minya',
      type: 'Investment',
      typeClass: 'investment',
      amount: 'EGP 125,000',
      roi: '20%',
      date: 'Jan 10, 2024',
      status: 'Active',
      statusClass: 'active',
      payment: 'Verified',
      paymentClass: 'verified'
    },
    {
      project: 'Rice Paddy - Kafr El-Sheikh',
      type: 'Return',
      typeClass: 'return',
      amount: 'EGP 70,200',
      roi: '17%',
      date: 'Apr 20, 2024',
      status: 'Completed',
      statusClass: 'completed',
      payment: 'Verified',
      paymentClass: 'verified'
    },
    {
      project: 'Sugarcane Farm - Qena',
      type: 'Investment',
      typeClass: 'investment',
      amount: 'EGP 80,000',
      roi: '19%',
      date: 'Feb 05, 2024',
      status: 'Active',
      statusClass: 'active',
      payment: 'Verified',
      paymentClass: 'verified'
    }
  ];
}
