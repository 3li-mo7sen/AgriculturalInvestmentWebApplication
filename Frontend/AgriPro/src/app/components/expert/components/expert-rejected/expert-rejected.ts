import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ExpertRejectedCards } from './components/expert-rejected-cards/expert-rejected-cards';
import { ExpertRejectedList } from './components/expert-rejected-list/expert-rejected-list';
import { ExpertRejectedSearch } from './components/expert-rejected-search/expert-rejected-search';
import { CommonModule } from '@angular/common';
import { ExpertService } from '../../../../services/expertService/expert.service';
import { RejectedProject } from '../../../../models/expert-rejected';



@Component({
  standalone: true,
  selector: 'app-expert-rejected',
  imports: [ExpertRejectedCards, ExpertRejectedList, ExpertRejectedSearch,CommonModule],
  templateUrl: './expert-rejected.html',
  styleUrls: ['./expert-rejected.css'],
})
export class ExpertRejected implements OnInit {
  rejectedProjects: RejectedProject[] = [];
  isLoading = true;

  searchQuery = '';
  selectedCrop = 'All Crops';
  selectedDateRange = 'All Time';

  constructor(
    private expertService: ExpertService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchRejectedProjects();
  }

  fetchRejectedProjects(): void {
    this.isLoading = true;
    this.expertService.getRejectedProjects().subscribe({
      next: (data) => {
        this.rejectedProjects = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching rejected projects:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get filteredProjects(): RejectedProject[] {
    const query = this.searchQuery.trim().toLowerCase();
    const now = new Date();

    return this.rejectedProjects.filter((project) => {
      const matchesSearch =
        !query ||
        project.title?.toLowerCase().includes(query) ||
        project.farmerName?.toLowerCase().includes(query) ||
        project.rejectionReason?.toLowerCase().includes(query);

      const matchesCrop =
        this.selectedCrop === 'All Crops' ||
        project.title?.toLowerCase().includes(this.selectedCrop.toLowerCase());

      let matchesDate = true;
      if (project.rejectionDate && this.selectedDateRange !== 'All Time') {
        const projDate = new Date(project.rejectionDate);
        const diffDays = Math.floor(
          (now.getTime() - projDate.getTime()) / (1000 * 3600 * 24)
        );

        if (this.selectedDateRange === 'Last 30 Days') {
          matchesDate = diffDays <= 30;
        } else if (this.selectedDateRange === 'Last 90 Days') {
          matchesDate = diffDays <= 90;
        }
      }

      return matchesSearch && matchesCrop && matchesDate;
    });
  }

  get summaryCards() {
    const totalCount = this.rejectedProjects.length;
    const distinctFarmers = new Set(
      this.rejectedProjects.map((item) => item.farmerName)
    ).size;

    const now = new Date();
    const last30 = this.rejectedProjects.filter((item) => {
      if (!item.rejectionDate) return false;
      const projDate = new Date(item.rejectionDate);
      const diffDays = Math.floor(
        (now.getTime() - projDate.getTime()) / (1000 * 3600 * 24)
      );
      return diffDays <= 30;
    }).length;

    const resubmissionAllowedCount = this.rejectedProjects.filter(
      (item) => item.resubmissionAllowed
    ).length;

    return [
      {
        title: 'Rejected Projects',
        value: totalCount,
        description: 'Total projects declined by experts',
      },
      {
        title: 'This Month',
        value: last30,
        description: 'Projects rejected in the last 30 days',
      },
      {
        title: 'Farmers Affected',
        value: distinctFarmers,
        description: 'Distinct farmers impacted',
      },
      {
        title: 'Resubmission Allowed',
        value: resubmissionAllowedCount,
        description: 'Projects allowed for re-evaluation',
      },
    ];
  }

  onSearch(query: string) {
    this.searchQuery = query;
  }

  onCrop(value: string) {
    this.selectedCrop = value;
  }

  onDateRange(value: string) {
    this.selectedDateRange = value;
  }
}
