import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invest-projects-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invest-projects-search.html',
  styleUrl: './invest-projects-search.css',
})
export class InvestProjectsSearch {
  openFilter: 'crop' | 'location' | 'risk' | null = null;
  selectedCrop = 'Crop Type';
  selectedLocation = 'Location';
  selectedRisk = 'Risk Level';

  cropOptions = ['All Crops', 'Wheat', 'Fruits', 'Vegetables', 'Rice', 'Cotton'];
  locationOptions = ['All Locations', 'Beheira', 'Ismailia', 'Fayoum', 'Minya'];
  riskOptions = ['All Levels', 'Low Risk', 'Medium Risk', 'High Risk'];

  constructor(private elementRef: ElementRef) {}

  toggleFilter(filter: 'crop' | 'location' | 'risk') {
    this.openFilter = this.openFilter === filter ? null : filter;
  }

  selectCrop(option: string) {
    this.selectedCrop = option;
    this.openFilter = null;
  }

  selectLocation(option: string) {
    this.selectedLocation = option;
    this.openFilter = null;
  }

  selectRisk(option: string) {
    this.selectedRisk = option;
    this.openFilter = null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.openFilter = null;
    }
  }
}
