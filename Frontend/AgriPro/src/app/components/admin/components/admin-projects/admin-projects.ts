import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Project } from '../../../../models/admin-projects';
import { AdminService } from '../../../../services/adminService/admin.service';
import { environment } from '../../../../../environment/environment';

@Component({
  selector: 'app-admin-projects',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-projects.html',
  styleUrl: './admin-projects.css',
})
export class AdminProjects implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  isLoading = false;
  isDeleting = false;


  selectedStatus = 'All';
  searchQuery = '';

  selectedProject: Project | null = null;
  projectToDelete: Project | null = null;
  errorMessage: string | null = null;

  skeletonArray = Array(6).fill(0);


  backendBaseUrl = environment.baseUrl;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.adminService.getAllProjects().subscribe({
      next: (data) => {
        
        this.projects = (data || []).filter((p) => p && typeof p === 'object' && p.id);
        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  applyFilter(): void {
  
    const rawQuery = this.searchQuery ? String(this.searchQuery) : '';
    const query = rawQuery.trim().toLowerCase();

    this.filteredProjects = this.projects.filter((p) => {
      if (!p) return false;

     
      const projectStatus = p.status ? String(p.status).toLowerCase() : '';
      const matchesStatus =
        this.selectedStatus === 'All' || projectStatus === this.selectedStatus.toLowerCase();

   
      if (!query) {
        return matchesStatus;
      }

      const projectName = p.name ? String(p.name).toLowerCase() : '';
      const farmerName = p.farmerName ? String(p.farmerName).toLowerCase() : '';

      const matchesSearch = projectName.includes(query) || farmerName.includes(query);

      return matchesStatus && matchesSearch;
    });

    this.cdr.detectChanges();
  }

  openDetailsModal(project: Project, event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.selectedProject = project;
    this.cdr.detectChanges();
  }

  closeDetailsModal(): void {
    this.selectedProject = null;
  }

  confirmDelete(project: Project): void {
    this.projectToDelete = project;
  }

  cancelDelete(): void {
    this.projectToDelete = null;
  }

  closeErrorModal(): void {
    this.errorMessage = null;
  }

  executeDelete(event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    if (!this.projectToDelete || this.isDeleting) return;

    this.isDeleting = true; 
    const id = this.projectToDelete.id;

    this.adminService.deleteProject(id).subscribe({
      next: () => {
        this.projects = this.projects.filter((p) => p.id !== id);
        this.applyFilter();
        this.projectToDelete = null;
        this.isDeleting = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        const errorMsg =
          err.error?.message ||
          'Cannot delete this project (it may be approved or has investments).';

       
        this.projectToDelete = null;
        this.isDeleting = false;
        this.errorMessage = errorMsg;
        this.cdr.detectChanges();
      },
    });
  }

  getImageUrl(url: string | null | undefined): string {
    if (!url || typeof url !== 'string') {
      return 'assets/images/Image-not-found.png'; 
    }

    return url.startsWith('http') ? url : `${this.backendBaseUrl}${url}`;
  }

  getDocUrl(url: string | null): string {
    if (!url) return '#';
    return url.startsWith('http') ? url : `${this.backendBaseUrl}${url}`;
  }
}
