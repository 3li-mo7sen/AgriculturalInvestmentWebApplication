import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-con-search',
  imports: [CommonModule,FormsModule],
  templateUrl: './con-search.html',
  styleUrls: ['./con-search.css'],
})
export class ConSearch {
  openStatus = false;
  selectedStatus = 'All Status';
  statusOptions = ['All Status', 'Active', 'Completed', 'Pending'];
  searchTerm: string = '';

  @Output() searchChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<string>();

  constructor(private elementRef: ElementRef) { }

  toggleStatus() {
    this.openStatus = !this.openStatus;
  }

  selectStatus(option: string) {
    this.selectedStatus = option;
    this.openStatus = false;
    this.statusChange.emit(this.selectedStatus);
  }

  onSearchInput() {
    this.searchChange.emit(this.searchTerm);
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.openStatus = false;
    }
  }
}
