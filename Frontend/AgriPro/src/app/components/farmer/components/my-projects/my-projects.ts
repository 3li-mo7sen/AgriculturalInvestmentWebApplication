import { Component, OnInit } from '@angular/core';
import { ProjectCards } from './components/project-cards/project-cards';
import { ProjectLifecycle } from './components/project-lifecycle/project-lifecycle';
import { FarmerService } from '../../../../services/farmerService/farmer.service';

@Component({
  selector: 'app-my-projects',
  imports: [ProjectCards,ProjectLifecycle],
  templateUrl: './my-projects.html',
  styleUrls: ['./my-projects.css'],
})
export class MyProjects implements OnInit{
  allProjects: any[] = []; 
  filteredProjects: any[] = []; 
  activeTab: string = 'All';

  constructor(private _farmerService: FarmerService) { }

  ngOnInit(): void {
    this._farmerService.getMyProjects().subscribe({
      next: (res) => {
        this.allProjects = res;
        this.filteredProjects = res; 
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
