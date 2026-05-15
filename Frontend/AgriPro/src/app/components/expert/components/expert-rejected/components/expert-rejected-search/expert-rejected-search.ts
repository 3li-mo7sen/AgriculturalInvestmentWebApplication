import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-expert-rejected-search',
  imports: [CommonModule],
  templateUrl: './expert-rejected-search.html',
  styleUrls: ['./expert-rejected-search.css'],
})
export class ExpertRejectedSearch {
  @Input() searchQuery = '';
  @Input() selectedCrop: 'All Crops' | 'Wheat' | 'Fruits' | 'Rice' | 'Maize' = 'All Crops';
  @Input() selectedDateRange: 'All Time' | 'Last 30 Days' | 'Last 90 Days' = 'All Time';
  @Input() cropOptions: string[] = [];
  @Input() dateRangeOptions: string[] = [];

  @Output() searchChange = new EventEmitter<string>();
  @Output() cropChange = new EventEmitter<'All Crops' | 'Wheat' | 'Fruits' | 'Rice' | 'Maize'>();
  @Output() dateRangeChange = new EventEmitter<'All Time' | 'Last 30 Days' | 'Last 90 Days'>();

  updateSearch(value: string) {
    this.searchChange.emit(value);
  }

  updateCrop(value: string) {
    this.cropChange.emit(value as 'All Crops' | 'Wheat' | 'Fruits' | 'Rice' | 'Maize');
  }

  updateDateRange(value: string) {
    this.dateRangeChange.emit(value as 'All Time' | 'Last 30 Days' | 'Last 90 Days');
  }
}
