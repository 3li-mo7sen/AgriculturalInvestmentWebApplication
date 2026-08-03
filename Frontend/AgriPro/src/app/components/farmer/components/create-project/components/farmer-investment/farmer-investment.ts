import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-farmer-investment',
  imports: [CommonModule,FormsModule],
  templateUrl: './farmer-investment.html',
  styleUrls: ['./farmer-investment.css'],
})
export class FarmerInvestment {
  @Output() previous = new EventEmitter<void>();
  
  @Output() submitForm = new EventEmitter<any>(); 


  @Input() projectSummaryData: any = {};


  data = {
    minimumInvestment: null as number | null,
    farmerProfitShare: null as number | null,
    investorProfitShare: null as number | null,
  };

  sharesSumError: boolean = false;

  sendData(form: NgForm) {
    this.sharesSumError = false;

 
    if (form.invalid) {
      Object.keys(form.controls).forEach(field => {
        const control = form.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }

 
    const farmerShare = Number(this.data.farmerProfitShare) || 0;
    const investorShare = Number(this.data.investorProfitShare) || 0;

    if (farmerShare + investorShare !== 100) {
      this.sharesSumError = true;

      setTimeout(() => {
        const errorElement = document.querySelector('.shares-error-banner');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);

      return;
    }

    console.log('Submit Button Clicked! Form is completely valid.');
    this.submitForm.emit(this.data);
  }


  onFarmerShareChange() {
    if (this.data.farmerProfitShare !== null && this.data.farmerProfitShare !== undefined) {
      const farmer = Number(this.data.farmerProfitShare);
      if (farmer >= 0 && farmer <= 100) {
        this.data.investorProfitShare = 100 - farmer;
        this.sharesSumError = false;
      }
    }
  }

  clearError() {
    this.sharesSumError = false;
  }
}
