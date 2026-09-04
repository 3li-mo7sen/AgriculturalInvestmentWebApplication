import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';


import { Subject, takeUntil } from 'rxjs';
import { FarmerService } from '../../../../services/farmerService/farmer.service';
import { environment } from '../../../../../environment/environment';

@Component({
  selector: 'app-project-details',
  imports: [RouterLink, CommonModule],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css',
})
export class ProjectDetails implements OnInit, OnDestroy {
  project: any = null;
  isLoading = true;
  errorMessage = '';
  apiUrl: string = environment.baseUrl;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private farmerService: FarmerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('id'));

    if (!projectId) {
      this.isLoading = false;
      this.errorMessage = 'Invalid Project ID';
      return;
    }

    this.farmerService.getProjectById(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.project = res;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error fetching project details', err);
          this.errorMessage = 'Failed to load project details. Please try again.';
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/project-placeholder.jpg';
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'published':
      case 'approved':
        return 'status-published';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-default';
    }
  }

  getStatusIcon(status: string): string {
    switch (status?.toLowerCase()) {
      case 'published':
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
