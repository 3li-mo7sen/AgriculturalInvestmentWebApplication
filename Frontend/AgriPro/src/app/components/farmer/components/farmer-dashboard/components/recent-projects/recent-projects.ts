import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-recent-projects',
  imports: [CommonModule],
  templateUrl: './recent-projects.html',
  styleUrls: ['./recent-projects.css'],
})
export class RecentProjects {
  @Input() projects: any[] = [];
}
