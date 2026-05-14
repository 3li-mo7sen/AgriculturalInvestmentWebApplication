import { Component, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invest-history-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './invest-history-search.html',
  styleUrls: ['./invest-history-search.css'],
  standalone: true
})
export class InvestHistorySearch {
  showStatusDropdown = false;
  showTypesDropdown = false;
  selectedStatus = 'All Status';
  selectedType = 'All Types';
  searchText = '';

  statuses = ['All Status', 'Active', 'Completed', 'Pending'];
  types = ['All Types', 'Investment', 'Return'];

  constructor(private elementRef: ElementRef) {}

  toggleStatusDropdown() {
    this.showStatusDropdown = !this.showStatusDropdown;
    if (this.showStatusDropdown) {
      this.showTypesDropdown = false;
    }
  }

  toggleTypesDropdown() {
    this.showTypesDropdown = !this.showTypesDropdown;
    if (this.showTypesDropdown) {
      this.showStatusDropdown = false;
    }
  }

  selectStatus(status: string) {
    this.selectedStatus = status;
    this.showStatusDropdown = false;
  }

  selectType(type: string) {
    this.selectedType = type;
    this.showTypesDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.showStatusDropdown = false;
      this.showTypesDropdown = false;
    }
  }

  exportData() {
    console.log('Exporting data...');
  }
}

