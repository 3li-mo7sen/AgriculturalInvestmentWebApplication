import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FarmerService } from '../../services/farmerService/farmer.service';

@Component({
  selector: 'app-project-details',
  imports: [RouterLink, CommonModule],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css',
})
export class ProjectDetails implements OnInit {
  project: any = null;
  isLoading = true;
  errorMessage = '';

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

    this.farmerService.getProjectById(projectId).subscribe({
      next: (res) => {
        this.project = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching project details', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
