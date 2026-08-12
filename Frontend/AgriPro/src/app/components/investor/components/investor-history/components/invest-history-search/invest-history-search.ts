import { CommonModule } from '@angular/common';
import { Component, HostListener, ElementRef, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-invest-history-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './invest-history-search.html',
  styleUrls: ['./invest-history-search.css'],
  standalone: true
})
export class InvestHistorySearch {
  @Output() searchChanged = new EventEmitter<string>();
  @Output() statusChanged = new EventEmitter<string>();

  showStatusDropdown = false;
  selectedStatus = 'All Status';
  searchText = '';

  statuses = ['All Status', 'Active', 'Completed'];

  constructor(private elementRef: ElementRef) { }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText = input.value;
    this.searchChanged.emit(this.searchText);
  }

  toggleStatusDropdown(): void {
    this.showStatusDropdown = !this.showStatusDropdown;
  }

  selectStatus(status: string): void {
    this.selectedStatus = status;
    this.showStatusDropdown = false;
    this.statusChanged.emit(status);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showStatusDropdown = false;
    }
  }
}

