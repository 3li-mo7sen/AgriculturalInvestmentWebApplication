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
  @Input() selectedCrop = 'All Crops';
  @Input() selectedDateRange = 'All Time';
  @Input() cropOptions: string[] = [];
  @Input() dateRangeOptions: string[] = [];

  @Output() searchChange = new EventEmitter<string>();
  @Output() cropChange = new EventEmitter<string>();
  @Output() dateRangeChange = new EventEmitter<string>();

  updateSearch(value: string) {
    this.searchChange.emit(value);
  }

  updateCrop(value: string) {
    this.cropChange.emit(value);
  }

  updateDateRange(value: string) {
    this.dateRangeChange.emit(value);
  }
}
