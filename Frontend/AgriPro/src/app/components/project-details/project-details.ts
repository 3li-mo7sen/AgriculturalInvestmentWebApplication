import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

  constructor(
    private route: ActivatedRoute,
    private farmerService: FarmerService
  ) { }

  ngOnInit(): void {
    const projectId = Number(this.route.snapshot.paramMap.get('id'));

    if (!projectId) return;

    this.farmerService.getProjectById(projectId).subscribe({
      next: (res) => {
        this.project = res;
      },
      error: (err) => {
        console.error('Error fetching project details', err);
      }
    });
  }
}
