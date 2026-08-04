import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FarmerService } from '../../../../../../services/farmerService/farmer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-cards',
  imports: [RouterLink,CommonModule],
  templateUrl: './project-cards.html',
  styleUrls: ['./project-cards.css'],
})
export class ProjectCards {
  allProjects: any[] = []; 
  filteredProjects: any[] = []; 
  activeTab: string = 'All';
  isLoading: boolean = true;

  constructor(private _projectService: FarmerService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadMyProjects();
  }

  loadMyProjects(): void {
    this.isLoading = true;

    this._projectService.getMyProjects().subscribe({
      next: (res) => {
        console.log(' Projects API Response:', res);
        this.allProjects = res || [];

        
        this.filterProjects('All');

        this.isLoading = false;


        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error fetching projects:', err);
        this.allProjects = [];
        this.filteredProjects = [];
        this.isLoading = false;

        this.cdr.detectChanges();
      }
    });
  }

  filterProjects(status: string) {
    this.activeTab = status;
    if (status === 'All') {
      this.filteredProjects = this.allProjects;
    } else {
   
      this.filteredProjects = this.allProjects.filter(p => p.status === status);
    }
  }
}
