import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-expert-verified-search',
  imports: [CommonModule,FormsModule],
  templateUrl: './expert-verified-search.html',
  styleUrls: ['./expert-verified-search.css'],
})
export class ExpertVerifiedSearch {
  @Output() searchChange = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<string>();

  searchTerm = '';
  selectedCrop = 'All Crops';
  crops = ['All Crops', 'Wheat', 'Vegetables', 'Rice', 'Fruits', 'Cotton', 'Sugarcane'];

  onInput(): void {
    this.searchChange.emit(this.searchTerm);
  }

  onSelect(): void {
    this.filterChange.emit(this.selectedCrop);
  }
}
