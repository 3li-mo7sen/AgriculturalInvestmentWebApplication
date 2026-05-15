import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface RejectedProject {
  project: string;
  location: string;
  farmer: string;
  email: string;
  phone: string;
  rejectedOn: string;
  rejectedDaysAgo: number;
  status: 'Rejected' | 'Under Appeal';
  reason: string;
  crop: string;
  size: string;
  fundingGoal: string;
  expectedROI: string;
  rejectionDetails: string;
  documents: { pdf: number; images: number };
  documentsList: { name: string; type: string }[];
}

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
