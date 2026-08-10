import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Project, ProjectFilter } from '../../../../../../models/investor-projects';
import { combineLatest, Subscription } from 'rxjs';
import { InvestorService } from '../../../../../../services/investorService/investor.service';

@Component({
  selector: 'app-invest-projects-projects',
  imports: [CommonModule],
  templateUrl: './invest-projects-projects.html',
  styleUrls: ['./invest-projects-projects.css'],
})
export class InvestProjectsProjects {
  allProjects: Project[] = [];
  filteredProjects: Project[] = [];
  isLoading: boolean = true;

  private sub: Subscription = new Subscription();

  constructor(
    private investorService: InvestorService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    this.sub.add(
      combineLatest([
        this.investorService.getAllProjects(),
        this.investorService.filter$,
      ]).subscribe({
        next: ([projects, filter]) => {
          this.allProjects = projects;
          this.applyFilters(filter);
          this.isLoading = false;
          this.cdr.detectChanges(); 
        },
        error: (err) => {
          console.error('Error fetching projects:', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      })
    );
  }

  
  calculateRoi(profit: number, cost: number): string {
    if (!cost || cost === 0) return '0%';
    const roi = (profit / cost) * 100;
    return `${roi.toFixed(1)}%`;
  }

  private applyFilters(filter: ProjectFilter): void {
    let result = [...this.allProjects];

    if (filter.searchQuery && filter.searchQuery.trim() !== '') {
      const q = filter.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.cropType?.toLowerCase().includes(q) ||
          p.governorate?.toLowerCase().includes(q) ||
          p.district?.toLowerCase().includes(q)
      );
    }

    if (filter.cropType && filter.cropType !== 'All Crops') {
      result = result.filter(
        (p) => p.cropType?.toLowerCase() === filter.cropType?.toLowerCase()
      );
    }

    if (filter.location && filter.location !== 'All Locations') {
      result = result.filter(
        (p) =>
          p.governorate?.toLowerCase().includes(filter.location!.toLowerCase()) ||
          p.district?.toLowerCase().includes(filter.location!.toLowerCase())
      );
    }

    if (filter.sortByProgress) {
      result.sort((a, b) => {
        const progA = a.fundingProgress ?? 0;
        const progB = b.fundingProgress ?? 0;
        return filter.sortByProgress === 'asc' ? progA - progB : progB - progA;
      });
    }

    this.filteredProjects = result;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
