import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SummaryCard {
  title: string;
  value: number | string;
  description: string;
}

@Component({
  standalone: true,
  selector: 'app-expert-rejected-cards',
  imports: [CommonModule],
  templateUrl: './expert-rejected-cards.html',
  styleUrls: ['./expert-rejected-cards.css'],
})
export class ExpertRejectedCards {
  @Input() cards: SummaryCard[] = [];
}
