import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-land-form',
  imports: [FormsModule,CommonModule],
  templateUrl: './land-form.html',
  styleUrls: ['./land-form.css'],
})
export class LandForm {
  //edit
  @Input() formData: any = {};
  @Output() continue = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();

  data = {
    /*cropType: '',*/
    governorate: '',
    district: '',
    landSize: null as number | null,
    soilType: '',
    waterSource: '',
    landOwnershipType: '',
    expectedCropSeason: ''
  };

  governorates = [
    'Cairo',
    'Giza',
    'Alexandria',
    'Dakahlia',
    'Red Sea',
    'Beheira',
    'Fayoum',
    'Gharbia',
    'Ismailia',
    'Monufia',
    'Minya',
    'Qalyubia',
    'New Valley',
    'Suez',
    'Aswan',
    'Assiut',
    'Beni Suef',
    'Port Said',
    'Damietta',
    'Sharkia',
    'South Sinai',
    'Kafr El-Sheikh',
    'Matrouh',
    'Luxor',
    'Qena',
    'North Sinai',
    'Sohag'
  ];

  //edit
  ngOnInit(): void {
    if (this.formData) {
      this.data = {
        governorate: this.formData.governorate || this.formData.Governorate || '',
        district: this.formData.district || this.formData.District || '',
        landSize: this.formData.landSize ?? this.formData.LandSize ?? null,
        soilType: this.formData.soilType || this.formData.SoilType || '',
        waterSource: this.formData.waterSource || this.formData.WaterSource || '',
        landOwnershipType: this.formData.landOwnershipType || this.formData.LandOwnershipType || '',
        expectedCropSeason: this.formData.expectedCropSeason || this.formData.ExpectedCropSeason || ''
      };
    }
  }
  sendData(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach(field => {
        const control = form.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }

    console.log('Sending from LandForm:', this.data); 
    this.continue.emit(this.data);
  }
}
