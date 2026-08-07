import { ChangeDetectorRef, Component } from '@angular/core';
import { ExpertVerifiedProjects } from './components/expert-verified-projects/expert-verified-projects';
import { ExpertVerifiedSearch } from './components/expert-verified-search/expert-verified-search';
import { ExpertVerifiedCards } from './components/expert-verified-cards/expert-verified-cards';
import { CommonModule } from '@angular/common';
import { VerifiedProject } from '../../../../models/expert-verified';
import { ExpertService } from '../../../../services/expertService/expert.service';

@Component({
  standalone: true,
  selector: 'app-expert-verified',
  imports: [ExpertVerifiedCards, ExpertVerifiedProjects, ExpertVerifiedSearch,CommonModule],
  templateUrl: './expert-verified.html',
  styleUrls: ['./expert-verified.css'],
})
export class ExpertVerified {
  projects: VerifiedProject[] = [];
  filteredProjects: VerifiedProject[] = [];
  isLoading = true;

  // إحصائيات المحسوبة تلقائياً من الـ API
  totalVerified = 0;
  totalFunding = 0;
  totalInvestors = 0;

  searchTerm = '';
  selectedCrop = 'All Crops';

  constructor(
    private expertService: ExpertService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchVerifiedProjects();
  }

  fetchVerifiedProjects(): void {
    this.isLoading = true;
    this.expertService.getVerifiedProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.filteredProjects = data;
        this.calculateMetrics(data);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching verified projects:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  calculateMetrics(data: VerifiedProject[]): void {
    this.totalVerified = data.length;
    this.totalFunding = data.reduce((sum, p) => sum + (p.fundingRaised || 0), 0);
    this.totalInvestors = data.reduce((sum, p) => sum + (p.investorsCount || 0), 0);
  }

  onSearchChange(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  onFilterChange(crop: string): void {
    this.selectedCrop = crop;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredProjects = this.projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(this.searchTerm) ||
        project.farmerName.toLowerCase().includes(this.searchTerm);

      const matchesCrop =
        this.selectedCrop === 'All Crops' ||
        project.title.toLowerCase().includes(this.selectedCrop.toLowerCase());

      return matchesSearch && matchesCrop;
    });
  }
}
