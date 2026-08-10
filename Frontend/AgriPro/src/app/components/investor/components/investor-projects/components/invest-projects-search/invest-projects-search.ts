import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvestorService } from '../../../../../../services/investorService/investor.service';

@Component({
  selector: 'app-invest-projects-search',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './invest-projects-search.html',
  styleUrls: ['./invest-projects-search.css'],
})
export class InvestProjectsSearch {
  openFilter: 'crop' | 'location' | 'sort' | null = null;
  selectedCrop = 'Crop Type';
  selectedLocation = 'Location';
  selectedSort = 'Sort by Progress';
  searchQuery = '';

  cropOptions = ['All Crops', 'Wheat', 'Fruits', 'Vegetables', 'Rice', 'Cotton'];
  locationOptions = ['All Locations', 'Kafr El-Sheikh', 'Beheira', 'Ismailia', 'Fayoum', 'Minya', 'Nile Delta, Egypt'];

 
  sortOptions = [
    { label: 'Default', value: null },
    { label: 'Highest Progress', value: 'desc' },
    { label: 'Lowest Progress', value: 'asc' },
  ] as const;

  constructor(
    private elementRef: ElementRef,
    private investorService: InvestorService
  ) { }

  ngOnInit(): void { }

  toggleFilter(filter: 'crop' | 'location' | 'sort') {
    this.openFilter = this.openFilter === filter ? null : filter;
  }

  onSearchChange(): void {
    this.investorService.updateFilter({ searchQuery: this.searchQuery });
  }

  selectCrop(option: string) {
    this.selectedCrop = option;
    this.openFilter = null;
    this.investorService.updateFilter({ cropType: option });
  }

  selectLocation(option: string) {
    this.selectedLocation = option;
    this.openFilter = null;
    this.investorService.updateFilter({ location: option });
  }

 
  selectSort(option: { label: string; value: 'asc' | 'desc' | null }) {
    this.selectedSort = option.label;
    this.openFilter = null;
    this.investorService.updateFilter({ sortByProgress: option.value });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.openFilter = null;
    }
  }
}
