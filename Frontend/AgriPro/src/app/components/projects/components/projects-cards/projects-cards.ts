import { ChangeDetectorRef, Component } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { Project, ProjectFilter } from '../../../../models/projects-projects';
import { environment } from '../../../../../environment/environment';
import { ProjectsService } from '../../../../services/projectsService/projects.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects-cards',
  imports: [CommonModule],
  templateUrl: './projects-cards.html',
  styleUrl: './projects-cards.css',
})
export class ProjectsCards {
  allProjects: Project[] = [];
  filteredProjects: Project[] = [];
  isLoading: boolean = true;
  apiUrl: string = environment.baseUrl;
  private sub: Subscription = new Subscription();

  constructor(
    private projectsService: ProjectsService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    this.sub.add(
      combineLatest([
        this.projectsService.getAllProjects(),
        this.projectsService.filter$,
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
  //////////////////////////////warning!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  goToDetails(projectId: number): void {

    this.router.navigate(['/investor/available-projects/project-details', projectId]);

  }
}
