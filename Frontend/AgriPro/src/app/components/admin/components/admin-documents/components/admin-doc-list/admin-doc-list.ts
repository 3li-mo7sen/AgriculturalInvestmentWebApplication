import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  name: string;
  location: string;
  farmer: string;
  status: string;
  fundingAmount: string;
  fundingPercent: number;
  investors: number;
  roi: string;
  crop: string;
}

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-admin-doc-list',
  imports: [CommonModule],
  templateUrl: './admin-doc-list.html',
  styleUrls: ['./admin-doc-list.css'],
  standalone: true,
})
export class AdminDocList {
  projects: Project[] = [
    {
      name: 'Organic Tomato Farm',
      location: 'Fayoum, Egypt',
      farmer: 'Ahmed Hassan',
      status: 'active',
      fundingAmount: 'EGP 425K',
      fundingPercent: 85,
      investors: 12,
      roi: '18%',
      crop: 'vegetables',
    },
    {
      name: 'Wheat Production Project',
      location: 'Beheira, Egypt',
      farmer: 'Omar Farouk',
      status: 'funding',
      fundingAmount: 'EGP 313K',
      fundingPercent: 42,
      investors: 8,
      roi: '15%',
      crop: 'grains',
    },
    {
      name: 'Date Palm Cultivation',
      location: 'Siwa, Egypt',
      farmer: 'Khaled Mahmoud',
      status: 'pending-review',
      fundingAmount: 'EGP 0K',
      fundingPercent: 0,
      investors: 0,
      roi: '22%',
      crop: 'fruits',
    },
    {
      name: 'Strawberry Greenhouse',
      location: 'Ismailia, Egypt',
      farmer: 'Mohamed Salem',
      status: 'expert-review',
      fundingAmount: 'EGP 0K',
      fundingPercent: 0,
      investors: 0,
      roi: '20%',
      crop: 'fruits',
    },
    {
      name: 'Cotton Farming Initiative',
      location: 'Alexandria, Egypt',
      farmer: 'Ibrahim Nasser',
      status: 'completed',
      fundingAmount: 'EGP 600K',
      fundingPercent: 100,
      investors: 15,
      roi: '16%',
      crop: 'industrial-crops',
    },
    {
      name: 'Citrus Orchard Expansion',
      location: 'Qalyubia, Egypt',
      farmer: 'Youssef Amin',
      status: 'rejected',
      fundingAmount: 'EGP 0K',
      fundingPercent: 0,
      investors: 0,
      roi: '14%',
      crop: 'fruits',
    },
  ];

  statusOptions: DropdownOption[] = [
    { label: 'All Status', value: 'all' },
    { label: 'Pending Review', value: 'pending-review' },
    { label: 'Expert Review', value: 'expert-review' },
    { label: 'Funding', value: 'funding' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
    { label: 'Rejected', value: 'rejected' },
  ];

  cropOptions: DropdownOption[] = [
    { label: 'All Crops', value: 'all' },
    { label: 'Vegetables', value: 'vegetables' },
    { label: 'Fruits', value: 'fruits' },
    { label: 'Grains', value: 'grains' },
    { label: 'Industrial Crops', value: 'industrial-crops' },
  ];

  selectedStatus: DropdownOption = this.statusOptions[0];
  selectedCrop: DropdownOption = this.cropOptions[0];
  isStatusMenuOpen = false;
  isCropMenuOpen = false;

  toggleStatusMenu(event: Event): void {
    event.stopPropagation();
    this.isStatusMenuOpen = !this.isStatusMenuOpen;
    if (this.isStatusMenuOpen) {
      this.isCropMenuOpen = false;
    }
  }

  toggleCropMenu(event: Event): void {
    event.stopPropagation();
    this.isCropMenuOpen = !this.isCropMenuOpen;
    if (this.isCropMenuOpen) {
      this.isStatusMenuOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  closeMenus(event: any): void {
    // Don't close if clicked on dropdown buttons or filter group
    if (event.target && !event.target.closest('.dropdown-filter') && !event.target.closest('.filter-group')) {
      this.isStatusMenuOpen = false;
      this.isCropMenuOpen = false;
    }
  }

  selectStatus(status: DropdownOption): void {
    this.selectedStatus = status;
    this.isStatusMenuOpen = false;
  }

  selectCrop(crop: DropdownOption): void {
    this.selectedCrop = crop;
    this.isCropMenuOpen = false;
  }

  getFilteredProjects(): Project[] {
    return this.projects.filter((project) => {
      const statusMatch =
        this.selectedStatus.value === 'all' ||
        project.status === this.selectedStatus.value;
      const cropMatch =
        this.selectedCrop.value === 'all' ||
        project.crop === this.selectedCrop.value;
      return statusMatch && cropMatch;
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active':
        return 'badge-active';
      case 'funding':
        return 'badge-funding';
      case 'pending-review':
        return 'badge-pending';
      case 'expert-review':
        return 'badge-expert';
      case 'completed':
        return 'badge-completed';
      case 'rejected':
        return 'badge-rejected';
      default:
        return '';
    }
  }

  getDisplayStatus(status: string): string {
    const map: { [key: string]: string } = {
      'pending-review': 'Pending Review',
      'expert-review': 'Expert Review',
      funding: 'Funding',
      active: 'Active',
      completed: 'Completed',
      rejected: 'Rejected',
    };
    return map[status] || status;
  }
}

