import { ChangeDetectorRef, Component } from '@angular/core';
import { AddProjectForm } from '../add-project-form/add-project-form';
import { LandForm } from '../land-form/land-form';
import { LandImages } from '../land-images/land-images';
import { FarmerDocuments } from '../farmer-documents/farmer-documents';
import { FarmerInvestment } from '../farmer-investment/farmer-investment';
import { CommonModule } from '@angular/common';
import { FarmerService } from '../../../../../../services/farmerService/farmer.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-project-forms',
  imports: [AddProjectForm,LandForm,LandImages,FarmerDocuments,FarmerInvestment,CommonModule],
  templateUrl: './create-project-forms.html',
  styleUrl: './create-project-forms.css',
})
export class CreateProjectForms {
  errorMessageList: string[] = [];
  currentStep = 0;

  rawFormData: any = {};
  /*
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
  */
  steps = [
    { label: 'Basic Info', icon: 'fas fa-info-circle' },
    { label: 'Land Details', icon: 'fas fa-map-marker-alt' },
    { label: 'Land Images', icon: 'fas fa-image' },
    { label: 'Documents', icon: 'fas fa-shield-alt' },
    { label: 'Investment', icon: 'fas fa-coins' }
  ];

  constructor(private _FarmerService: FarmerService, private router: Router,private cdr: ChangeDetectorRef) { }

  handleStepData(data: any) {
    
    this.rawFormData = { ...this.rawFormData, ...data };

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


    const payload = {
      Name: this.rawFormData.Name || this.rawFormData.title || this.rawFormData.name || '',
      ShortDescription: this.rawFormData.ShortDescription || this.rawFormData.shortDescription || '',
      FullDescription: this.rawFormData.FullDescription || this.rawFormData.fullDescription || '',
      CropType: this.rawFormData.CropType || this.rawFormData.cropType || '',
      Governorate: this.rawFormData.Governorate || this.rawFormData.governorate || '',
      District: this.rawFormData.District || this.rawFormData.district || '',

      SoilType: this.rawFormData.SoilType || this.rawFormData.soilType || '',
      WaterSource: this.rawFormData.WaterSource || this.rawFormData.waterSource || '',
      LandOwnershipType: this.rawFormData.LandOwnershipType || this.rawFormData.landOwnershipType || '',
      ExpectedCropSeason: this.rawFormData.ExpectedCropSeason || this.rawFormData.expectedCropSeason || '',

     
      LandSize: Number(this.rawFormData.LandSize ?? this.rawFormData.landSize) || 0,
      Cost: Number(this.rawFormData.Cost ?? this.rawFormData.cost) || 0,
      MinimumInvestment: Number(this.rawFormData.MinimumInvestment ?? this.rawFormData.minimumInvestment) || 0,
      ExpectedProfit: Number(this.rawFormData.ExpectedProfit ?? this.rawFormData.expectedProfit) || 0,
      Duration: Number(this.rawFormData.Duration ?? this.rawFormData.duration) || 0,
      FarmerProfitShare: Number(this.rawFormData.FarmerProfitShare ?? this.rawFormData.farmerProfitShare) || 0,
      InvestorProfitShare: Number(this.rawFormData.InvestorProfitShare ?? this.rawFormData.investorProfitShare) || 0,

     
      Image: this.rawFormData.Image || this.rawFormData.image || null,
      LandOwnershipDoc: this.rawFormData.LandOwnershipDoc || this.rawFormData.landOwnershipDoc || null,
      NationalIdDoc: this.rawFormData.NationalIdDoc || this.rawFormData.nationalIdDoc || null,
      AgriculturalPermitDoc: this.rawFormData.AgriculturalPermitDoc || this.rawFormData.agriculturalPermitDoc || null,
      WaterRightsDoc: this.rawFormData.WaterRightsDoc || this.rawFormData.waterRightsDoc || null
    };

    console.log('Final Prepared Payload:', payload);

    this._FarmerService.createProject(payload).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Success!',
          text: 'Project submitted successfully!',
          icon: 'success',
          confirmButtonText: 'Go to My Projects',
          confirmButtonColor: '#2e7d32', 
          customClass: {
            popup: 'rounded-4'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/farmer/my-projects']);
          }
        });
      },
      error: (err) => {
        console.error('Validation Errors:', err);

      
        this.errorMessageList = this.extractErrors(err);

        Swal.fire({
          title: 'Submission Failed',
          text: 'Please review the error messages at the top of the form.',
          icon: 'error',
          confirmButtonColor: '#d33',
        });

        this.cdr.detectChanges();

      
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  private extractErrors(err: any): string[] {
    const errors: string[] = [];

    if (err.error?.errors) {

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
