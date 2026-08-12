import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AvailableProjectItem } from '../../../../../../models/investor-dashboard';

@Component({
  standalone: true,
  selector: 'app-invest-dash-projects',
  imports: [CommonModule,RouterLink],
  templateUrl: './invest-dash-projects.html',
  styleUrls: ['./invest-dash-projects.css'],
})
export class InvestDashProjects {
  @Input() projects: AvailableProjectItem[] = [];
}
