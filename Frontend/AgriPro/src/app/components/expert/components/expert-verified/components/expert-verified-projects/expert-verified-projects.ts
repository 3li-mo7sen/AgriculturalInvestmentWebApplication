import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifiedProject } from '../../../../../../models/expert-verified';

@Component({
  standalone: true,
  selector: 'app-expert-verified-projects',
  imports: [CommonModule],
  templateUrl: './expert-verified-projects.html',
  styleUrls: ['./expert-verified-projects.css'],
})
export class ExpertVerifiedProjects {
  @Input() projects: VerifiedProject[] = [];
}
