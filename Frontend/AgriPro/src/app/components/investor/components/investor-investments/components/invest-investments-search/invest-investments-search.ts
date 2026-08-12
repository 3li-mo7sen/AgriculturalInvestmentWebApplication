import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invest-investments-search',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './invest-investments-search.html',
  styleUrls: ['./invest-investments-search.css'],
})
export class InvestInvestmentsSearch {
  @Output() searchChanged = new EventEmitter<string>();
  @Output() statusChanged = new EventEmitter<string>();

  openStatus = false;
  selectedStatus = 'All Status';
  statusOptions = ['All Status', 'Active', 'Pending', 'Completed'];
  searchTerm = '';

  constructor(private elementRef: ElementRef) { }

  onInputSearch(): void {
    this.searchChanged.emit(this.searchTerm);
  }

  toggleStatus(): void {
    this.openStatus = !this.openStatus;
  }

  selectStatus(option: string): void {
    this.selectedStatus = option;
    this.openStatus = false;
    this.statusChanged.emit(option);
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.openStatus = false;
    }
  }
}
