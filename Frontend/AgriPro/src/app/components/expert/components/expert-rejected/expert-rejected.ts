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
      
      const projectName = (project.name || project.title || '').toLowerCase();
      const farmerName = (project.farmerName || '').toLowerCase();
      const rejectionReason = (project.rejectionReason || '').toLowerCase();
      const governorate = (project.governorate || '').toLowerCase();
      const district = (project.district || '').toLowerCase();

      
      const matchesSearch =
        !query ||
        projectName.includes(query) ||
        farmerName.includes(query) ||
        rejectionReason.includes(query) ||
        governorate.includes(query) ||
        district.includes(query);

    
      const matchesCrop =
        this.selectedCrop === 'All Crops' ||
        projectName.includes(this.selectedCrop.toLowerCase()) ||
        (project.cropType && project.cropType.toLowerCase().includes(this.selectedCrop.toLowerCase()));

    
      let matchesDate = true;
      const targetDate = project.rejectionDate || project.rejectedAt;
      if (targetDate && this.selectedDateRange !== 'All Time') {
        const projDate = new Date(targetDate);
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

    return [
      {
        title: 'Rejected Projects',
        value: totalCount,
        description: 'Total projects declined by experts',
      }
    ];
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.cdr.detectChanges(); 
  }

  onCrop(value: string) {
    this.selectedCrop = value;
  }

  onDateRange(value: string) {
    this.selectedDateRange = value;
  }
}
