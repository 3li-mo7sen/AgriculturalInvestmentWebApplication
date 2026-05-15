import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-con-search',
  imports: [CommonModule],
  templateUrl: './con-search.html',
  styleUrl: './con-search.css',
})
export class ConSearch {
  openStatus = false;
  selectedStatus = 'All Status';
  statusOptions = ['All Status', 'Active', 'Completed', 'Pending'];

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
