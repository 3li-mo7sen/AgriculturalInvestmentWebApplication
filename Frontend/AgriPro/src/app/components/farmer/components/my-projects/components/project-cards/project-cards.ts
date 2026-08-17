import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FarmerService } from '../../../../../../services/farmerService/farmer.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../../../environment/environment';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-project-cards',
  imports: [RouterLink,CommonModule],
  templateUrl: './project-cards.html',
  styleUrls: ['./project-cards.css'],
})
export class ProjectCards implements OnInit, OnDestroy {
  allProjects: any[] = [];
  filteredProjects: any[] = [];
  activeTab: string = 'All';
  isLoading: boolean = true;
  apiUrl: string = environment.baseUrl;

  private destroy$ = new Subject<void>();
  constructor(
    private _projectService: FarmerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProjects('All');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

 
  loadProjects(status: string): void {
    this.activeTab = status;

    if (this.allProjects.length > 0 && status !== 'All') {
      this.filterLocally(status);
      return;
    }

    this.isLoading = true;

    if (status === 'All') {
      this._projectService.getMyProjects()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.allProjects = res || [];
            this.filteredProjects = this.allProjects;
            this.isLoading = false;
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error('❌ Error fetching all projects:', err);
            this.allProjects = [];
            this.filteredProjects = [];
            this.isLoading = false;
            this.cdr.markForCheck();
          }
        });
    } else {
      this._projectService.getProjectsByStatus(status)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.filteredProjects = res || [];
            this.isLoading = false;
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error(`❌ Error fetching status [${status}]:`, err);
            this.filteredProjects = [];
            this.isLoading = false;
            this.cdr.markForCheck();
          }
        });
    }
  }

  private filterLocally(status: string) {
    this.filteredProjects = this.allProjects.filter(
      p => p.status?.toLowerCase() === status.toLowerCase()
    );
    this.cdr.markForCheck();
  }
 
  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'published':
        return 'badge-published';
      case 'approved':
        return 'badge-approved';
      case 'pending':
        return 'badge-pending';
      case 'rejected':
        return 'badge-rejected';
      default:
        return 'badge-default';
    }
  }


  getStatusIcon(status: string): string {
    switch (status?.toLowerCase()) {
      case 'published':
        return 'fa-rocket';
      case 'approved':
        return 'fa-circle-check';
      case 'pending':
        return 'fa-clock';
      case 'rejected':
        return 'fa-circle-xmark';
      default:
        return 'fa-circle-info';
    }
  }

  
}
