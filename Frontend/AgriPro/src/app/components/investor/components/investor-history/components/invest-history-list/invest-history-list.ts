import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryItem } from '../../../../../../models/investor-history';

@Component({
  selector: 'app-invest-history-list',
  imports: [CommonModule],
  templateUrl: './invest-history-list.html',
  styleUrls: ['./invest-history-list.css'],
  standalone: true
})
export class InvestHistoryList {
  @Input() historyItems: HistoryItem[] = [];
}
