import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Investment } from '../../../../../../models/investor-my-investments';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invest-investments-projects',
  imports: [CommonModule],
  templateUrl: './invest-investments-projects.html',
  styleUrls: ['./invest-investments-projects.css'],
})
export class InvestInvestmentsProjects {
  @Input() investments: Investment[] = [];

  constructor(private router: Router) { }

  calculateRoi(expectedReturn: number, amount: number): string {
    if (!amount || amount === 0) return '0%';
    const roi = (expectedReturn / amount) * 100;
    return `${roi.toFixed(1)}%`;
  }

  viewDetails(projectId: number): void {
    this.router.navigate(['/investor/available-projects/project-details', projectId]);
  }

  goToProjects(): void {
    this.router.navigate(['/investor/available-projects']);
  }
}
