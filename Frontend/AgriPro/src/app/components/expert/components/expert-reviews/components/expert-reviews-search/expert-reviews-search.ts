import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expert-reviews-search',
  imports: [CommonModule],
  templateUrl: './expert-reviews-search.html',
  styleUrls: ['./expert-reviews-search.css'],
})
export class ExpertReviewsSearch {
  @Input() searchQuery = '';
  @Input() selectedUrgency = 'All Urgency';
  @Input() selectedCrop = 'All Crops';
  @Input() urgencyOptions: string[] = [];
  @Input() cropOptions: string[] = [];

  @Output() searchChange = new EventEmitter<string>();
  @Output() urgencyChange = new EventEmitter<any>();
  @Output() cropChange = new EventEmitter<string>();

  updateSearch(value: string) {
    this.searchChange.emit(value);
  }

  updateUrgency(value: string) {
    this.urgencyChange.emit(value);
  }

  updateCrop(value: string) {
    this.cropChange.emit(value);
  }
}
