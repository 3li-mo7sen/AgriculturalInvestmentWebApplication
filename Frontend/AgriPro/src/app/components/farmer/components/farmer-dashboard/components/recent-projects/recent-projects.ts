import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-recent-projects',
  imports: [CommonModule,RouterLink],
  templateUrl: './recent-projects.html',
  styleUrls: ['./recent-projects.css'],
})
export class RecentProjects {
  @Input() projects: any[] = [];
}
