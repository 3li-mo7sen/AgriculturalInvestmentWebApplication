import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-farmer-documents',
  imports: [CommonModule],
  templateUrl: './farmer-documents.html',
  styleUrls: ['./farmer-documents.css'],
})
export class FarmerDocuments {
  @Output() continue = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();

 
  landOwnershipDoc: File | null = null;
  nationalIdDoc: File | null = null;
  agriculturalPermitDoc: File | null = null;
  waterRightsDoc: File | null = null;

  landError: boolean = false;
  landErrorMessage: string = '';

  idError: boolean = false;
  idErrorMessage: string = '';

  maxFileSizeMB = 10;

  
  onFileSelected(event: any, docType: string) {
    const file = event.target.files[0];
    if (!file) return;

   
    if (file.size > this.maxFileSizeMB * 1024 * 1024) {
      if (docType === 'land') {
        this.landError = true;
        this.landErrorMessage = 'File size must be less than 10MB.';
      } else if (docType === 'id') {
        this.idError = true;
        this.idErrorMessage = 'File size must be less than 10MB.';
      }
      return;
    }

    if (docType === 'land') {
      this.landOwnershipDoc = file;
      this.landError = false;
    } else if (docType === 'id') {
      this.nationalIdDoc = file;
      this.idError = false;
    } else if (docType === 'permit') {
      this.agriculturalPermitDoc = file;
    } else if (docType === 'water') {
      this.waterRightsDoc = file;
    }
  }

 
  sendData() {
    let isValid = true;

  
    if (!this.landOwnershipDoc) {
      this.landError = true;
      this.landErrorMessage = 'Land ownership or lease contract is required.';
      isValid = false;
    }

    
    if (!this.nationalIdDoc) {
      this.idError = true;
      this.idErrorMessage = 'National ID document is required.';
      isValid = false;
    }

    if (!isValid) return;

    
    this.continue.emit({
      LandOwnershipDoc: this.landOwnershipDoc,
      NationalIdDoc: this.nationalIdDoc,
      AgriculturalPermitDoc: this.agriculturalPermitDoc,
      WaterRightsDoc: this.waterRightsDoc,
    });
  }
}
