import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invest-investments-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invest-investments-search.html',
  styleUrls: ['./invest-investments-search.css'],
})
export class InvestInvestmentsSearch {
  openStatus = false;
  selectedStatus = 'All Status';
  statusOptions = ['All Status', 'Active', 'Pending', 'Completed'];

  constructor(private elementRef: ElementRef) {}

  toggleStatus() {
    this.openStatus = !this.openStatus;
  }

  selectStatus(option: string) {
    this.selectedStatus = option;
    this.openStatus = false;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.openStatus = false;
    }
  }
}
