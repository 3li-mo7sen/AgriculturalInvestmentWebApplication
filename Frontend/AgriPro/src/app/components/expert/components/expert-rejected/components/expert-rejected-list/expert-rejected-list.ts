import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RejectedProject } from '../../../../../../models/expert-rejected';



@Component({
  standalone: true,
  selector: 'app-expert-rejected-list',
  imports: [CommonModule],
  templateUrl: './expert-rejected-list.html',
  styleUrls: ['./expert-rejected-list.css'],
})
export class ExpertRejectedList {
  @Input() projects: RejectedProject[] = [];

  selectedProject: RejectedProject | null = null;

  openProject(project: RejectedProject) {
    this.selectedProject = project;
  }

  closeProject() {
    this.selectedProject = null;
  }
}
