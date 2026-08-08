import { ChangeDetectorRef, Component } from '@angular/core';
import { ExpertReviewsSearch } from './components/expert-reviews-search/expert-reviews-search';
import { ExpertReviewsList } from './components/expert-reviews-list/expert-reviews-list';
import { CommonModule } from '@angular/common';
import { PendingProject } from '../../../../models/expert-pending';
import { ExpertService } from '../../../../services/expertService/expert.service';



@Component({
  selector: 'app-expert-reviews',
  imports: [ExpertReviewsList, ExpertReviewsSearch,CommonModule],
  templateUrl: './expert-reviews.html',
  styleUrls: ['./expert-reviews.css'],
})
export class ExpertReviews {
  pendingProjects: PendingProject[] = [];
  isLoading = true;

  searchQuery = '';
  urgencyFilter: 'All Urgency' | 'High' | 'Medium' | 'Low' = 'All Urgency';
  cropFilter: 'All Crops' | 'Wheat' | 'Fruits' | 'Rice' | string = 'All Crops';

  constructor(
    private expertService: ExpertService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchPendingProjects();
  }

  fetchPendingProjects(): void {
    this.isLoading = true;
    this.expertService.getPendingProjects().subscribe({
      next: (data) => {
        this.pendingProjects = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching pending projects:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get filteredReviews(): PendingProject[] {
    return this.pendingProjects.filter((project) => {
      const query = this.searchQuery.trim().toLowerCase();

      const matchesSearch =
        !query ||
        project.name?.toLowerCase().includes(query) ||
        project.governorate?.toLowerCase().includes(query) ||
        project.farmerName?.toLowerCase().includes(query) ||
        project.cropType?.toLowerCase().includes(query);

      const matchesCrop =
        this.cropFilter === 'All Crops' ||
        project.cropType?.toLowerCase() === this.cropFilter.toLowerCase();

      return matchesSearch && matchesCrop;
    });
  }

  onSearch(query: string) {
    this.searchQuery = query;
  }

  onUrgency(value: 'All Urgency' | 'High' | 'Medium' | 'Low') {
    this.urgencyFilter = value;
  }

  onCrop(value: string) {
    this.cropFilter = value;
  }

  onProjectActionSuccess() {
    this.fetchPendingProjects();
  }
}
