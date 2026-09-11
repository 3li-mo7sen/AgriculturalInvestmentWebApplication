import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectsService } from '../../../../services/projectsService/projects.service';

@Component({
  selector: 'app-projects-search',
  imports: [CommonModule,FormsModule],
  templateUrl: './projects-search.html',
  styleUrl: './projects-search.css',
})
export class ProjectsSearch {
  searchQuery: string = '';

  constructor(private projectsService: ProjectsService) { }

  onSearchChange(): void {
    this.projectsService.updateFilter({ searchQuery: this.searchQuery });
  }
}
