import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { FarmerService } from '../../services/farmerService/farmer.service';

@Component({
  selector: 'app-project-details',
  imports: [RouterLink,RouterLinkActive,CommonModule],
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-details',
  imports: [RouterLink],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css',
})
export class ProjectDetails implements OnInit{
  project: any; // هنخزن هنا داتا المشروع اللي هتيجي من الـ API

  constructor(
    private route: ActivatedRoute,
    private _farmerService: FarmerService
  ) { }

  ngOnInit(): void {
    // 1. بناخد الـ id من اللينك
    const projectId = Number(this.route.snapshot.paramMap.get('id'));

    if (projectId) {
      // 2. بننده الـ API
      this._farmerService.getProjectById(projectId).subscribe({
        next: (res) => {
          this.project = res;
        },
        error: (err) => {
          console.error('Error fetching project details', err);
        }
      });
    }
  }

}
