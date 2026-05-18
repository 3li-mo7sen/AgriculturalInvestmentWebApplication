import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FarmerService } from '../../../../../../services/farmerService/farmer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-cards',
  imports: [RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './project-cards.html',
  styleUrls: ['./project-cards.css'],
})
export class ProjectCards {
  allProjects: any[] = []; // الداتا الأصلية
  filteredProjects: any[] = []; // الداتا اللي بتظهر بعد الفلترة
  activeTab: string = 'All';

  constructor(private _projectService: FarmerService) { }

  ngOnInit(): void {
    this._projectService.getMyProjects().subscribe({
      next: (res) => {
        this.allProjects = res;
        this.filteredProjects = res; // في البداية بنعرض كله
      }
    });
  }

  filterProjects(status: string) {
    this.activeTab = status;
    if (status === 'All') {
      this.filteredProjects = this.allProjects;
    } else {
      // بنفلتر بناءً على الـ Status اللي راجع من الـ API
      this.filteredProjects = this.allProjects.filter(p => p.status === status);
    }
  }
}
