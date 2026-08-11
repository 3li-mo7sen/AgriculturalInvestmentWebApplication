import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { InvestorService } from '../../../../services/investorService/investor.service';
import { Project } from '../../../../models/investor-projects';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environment/environment';

@Component({
  selector: 'app-investor-project-details',
  imports: [CommonModule,RouterModule],
  templateUrl: './investor-project-details.html',
  styleUrl: './investor-project-details.css',
})
export class InvestorProjectDetails {
  project: Project | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  private sub: Subscription = new Subscription();
  apiUrl: string=environment.baseUrl;
  constructor(
    private route: ActivatedRoute,
    private investorService: InvestorService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
   
    this.sub.add(
      this.route.paramMap.subscribe((params) => {
        const idParam = params.get('id');
        if (idParam) {
          this.fetchProjectDetails(Number(idParam));
        } else {
          this.errorMessage = 'Project ID is missing';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      })
    );
  }

  fetchProjectDetails(id: number): void {
    this.isLoading = true;
    this.investorService.getProjectById(id).subscribe({
      next: (data) => {
        this.project = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching project details:', err);
        this.errorMessage = 'Failed to load project details.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  calculateRoi(profit: number, cost: number): string {
    if (!cost || cost === 0) return '0%';
    const roi = (profit / cost) * 100;
    return `${roi.toFixed(1)}%`;
  }

  onInvest(): void {
   
    alert(`Proceeding to invest in ${this.project?.name}`);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
