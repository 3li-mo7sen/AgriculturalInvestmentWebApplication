import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
 
  selector: 'app-stats-cards',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './stats-cards.html',
  styleUrls: ['./stats-cards.css'],
})
export class StatsCards {
  @Input() stats: any;

}
