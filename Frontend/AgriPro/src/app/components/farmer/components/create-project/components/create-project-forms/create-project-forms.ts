import { ChangeDetectorRef, Component } from '@angular/core';
import { AddProjectForm } from '../add-project-form/add-project-form';
import { LandForm } from '../land-form/land-form';
import { LandImages } from '../land-images/land-images';
import { FarmerDocuments } from '../farmer-documents/farmer-documents';
import { FarmerInvestment } from '../farmer-investment/farmer-investment';
import { CommonModule } from '@angular/common';
import { FarmerService } from '../../../../../../services/farmerService/farmer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-project-forms',
  imports: [AddProjectForm,LandForm,LandImages,FarmerDocuments,FarmerInvestment,CommonModule],
  templateUrl: './create-project-forms.html',
  styleUrl: './create-project-forms.css',
})
export class CreateProjectForms {
  errorMessageList: string[] = [];
  currentStep = 0;

  finalProjectData: any = {
    Name: "",
    ShortDescription: "",
    FullDescription: "",
    CropType: "",
    Governorate: "",
    District: "",
    LandSize: 0,
    SoilType: "",
    WaterSource: "",
    LandOwnershipType: "",
    ExpectedCropSeason: "",
    Cost: 0,
    MinimumInvestment: 0,
    ExpectedProfit: 0,
    Duration: 0,
    FarmerProfitShare: 0,
    InvestorProfitShare: 0,
    Image: null,
    LandOwnershipDoc: null,
    NationalIdDoc: null,
    AgriculturalPermitDoc: null,
    WaterRightsDoc: null
  };

  steps = [
    { label: 'Basic Info', icon: 'fas fa-info-circle' },
    { label: 'Land Details', icon: 'fas fa-map-marker-alt' },
    { label: 'Land Images', icon: 'fas fa-image' },
    { label: 'Documents', icon: 'fas fa-shield-alt' },
    { label: 'Investment', icon: 'fas fa-coins' }
  ];

  constructor(private _FarmerService: FarmerService, private router: Router,private cdr: ChangeDetectorRef) { }

  handleStepData(data: any) {
    this.finalProjectData = { ...this.finalProjectData, ...data };

    // إذا كانت هذه الخطوة هي الأخيرة (الاستثمار) أو عند استدعاء الإرسال النهائي
    if (this.currentStep === this.steps.length - 1) {
      this.submitToApi();
    } else {
      this.nextStep();
    }
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  submitToApi() {
    this.errorMessageList = [];
    this._FarmerService.createProject(this.finalProjectData).subscribe({
      next: (res) => {
        alert('Project submitted successfully!');
        this.router.navigate(['/farmer/my-projects']);
      },
      error: (err) => {
        console.error('Validation Errors:', err);

        // استخراج وتنسيق الأخطاء القادمة من السيرفر
        this.errorMessageList = this.extractErrors(err);

        this.cdr.detectChanges();

        // التمرير لأعلى الصفحة بسلاسة ليراها المستخدم فوراً
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  private extractErrors(err: any): string[] {
    const errors: string[] = [];

    if (err.error?.errors) {
      // لو السيرفر مراجع ModelState validation errors
      Object.keys(err.error.errors).forEach(key => {
        const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
        errors.push(`${fieldName}: ${err.error.errors[key].join(', ')}`);
      });
    } else if (err.error?.message) {
      errors.push(err.error.message);
    } else if (typeof err.error === 'string') {
      errors.push(err.error);
    } else {
      errors.push('An error occurred while submitting the project. Please ensure all required fields and files are completed.');
    }

    return errors;
  }
}
