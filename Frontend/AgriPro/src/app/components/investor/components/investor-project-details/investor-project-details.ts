import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InvestorService } from '../../../../services/investorService/investor.service';
import { Project } from '../../../../models/investor-projects';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environment/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-investor-project-details',
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './investor-project-details.html',
  styleUrl: './investor-project-details.css',
})
export class InvestorProjectDetails {
  @ViewChild('wizardSection') wizardSection!: ElementRef;
  submitError: string = '';
  project: Project | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  private sub: Subscription = new Subscription();
  apiUrl: string = environment.baseUrl;


  showWizard: boolean = false;
  currentStep: number = 1;
  investmentAmount: number = 0;
  agreedToTerms: boolean = false;
  selectedFile: File | null = null;
  isSubmitting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private investorService: InvestorService,
    private cdr: ChangeDetectorRef,
    private router: Router
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

  get calculatedExpectedReturn(): number {
    if (!this.project || !this.project.cost || !this.investmentAmount) return 0;
    const roiPercentage = (this.project.expectedProfit / this.project.cost);
    return Math.round(this.investmentAmount * roiPercentage);
  }

  onInvest(): void {
    this.showWizard = true;
    this.currentStep = 1;
    this.cdr.detectChanges();

    setTimeout(() => {
      if (this.wizardSection) {
        this.wizardSection.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  
  }

  closeWizard(): void {
    this.showWizard = false;
    this.currentStep = 1;
  }

  nextStep(): void {
    if (this.currentStep < 5) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.submitError = '';
      this.currentStep--;
    } else {
      this.closeWizard();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  submitInvestment(): void {
    if (!this.project) return;

    this.isSubmitting = true;
    this.submitError = '';

    const payload = {
      projectId: this.project.id,
      amount: this.investmentAmount,
    };

    this.investorService.createInvestment(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.currentStep = 5; 
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Investment failed:', err);
        this.isSubmitting = false;

        this.submitError = 'Failed to submit investment. Please try again.';
        
     
        this.cdr.detectChanges();
      },
    });
  }

  goToMyInvestments(): void {
    this.router.navigate(['/investor/my-investments']);
  }

  browseMoreProjects(): void {
    this.router.navigate(['/investor/available-projects']);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
