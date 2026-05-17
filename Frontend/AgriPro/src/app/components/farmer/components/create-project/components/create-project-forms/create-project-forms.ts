import { Component } from '@angular/core';
import { AddProjectForm } from '../add-project-form/add-project-form';
import { LandForm } from '../land-form/land-form';
import { LandImages } from '../land-images/land-images';
import { FarmerDocuments } from '../farmer-documents/farmer-documents';
import { FarmerInvestment } from '../farmer-investment/farmer-investment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-project-forms',
  imports: [AddProjectForm,LandForm,LandImages,FarmerDocuments,FarmerInvestment,CommonModule],
  templateUrl: './create-project-forms.html',
  styleUrl: './create-project-forms.css',
})
export class CreateProjectForms {
  currentStep = 0; // الخطوة الحالية تبدأ من 0

  steps = [
    { label: 'Basic Info', icon: 'fas fa-info-circle' },
    { label: 'Land Details', icon: 'fas fa-map-marker-alt' },
    { label: 'Land Images', icon: 'fas fa-image' },
    { label: 'Documents', icon: 'fas fa-shield-alt' },
    { label: 'Investment', icon: 'fas fa-coins' }
  ];

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

}
