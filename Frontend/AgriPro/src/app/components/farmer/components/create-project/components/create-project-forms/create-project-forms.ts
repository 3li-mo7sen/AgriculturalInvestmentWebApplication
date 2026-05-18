import { Component } from '@angular/core';
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
  currentStep = 0;

  finalProjectData: any = {
    title: "",
    shortDescription: "",
    fullDescription: "",
    cropType: "",
    governorate: "",
    landSize: "",
    soilType: "",
    waterSource: "",
    cost: 0,
    targetAmount: 0,
    minInvestment: 0,
    expectedProfit: 0,
    expectedRoi: "",
    duration: 0,
    farmerShare: 0
  };

  steps = [
    { label: 'Basic Info', icon: 'fas fa-info-circle' },
    { label: 'Land Details', icon: 'fas fa-map-marker-alt' },
    { label: 'Land Images', icon: 'fas fa-image' },
    { label: 'Documents', icon: 'fas fa-shield-alt' },
    { label: 'Investment', icon: 'fas fa-coins' }
  ];

  constructor(private _FarmerService:FarmerService,private router:Router) { }

  handleStepData(data: any) {
    this.finalProjectData = { ...this.finalProjectData, ...data };
    this.nextStep();
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
    this._FarmerService.createProject(this.finalProjectData).subscribe({
      next: (res) => {
        alert('project submitted successfully!');
        this.router.navigate(['/farmer/my-projects']);
      },
      error: (err) => alert('project submit failed!')
    });
  }

}
