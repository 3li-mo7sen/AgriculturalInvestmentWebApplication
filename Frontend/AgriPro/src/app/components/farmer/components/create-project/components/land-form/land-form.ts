import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-land-form',
  imports: [FormsModule,CommonModule],
  templateUrl: './land-form.html',
  styleUrls: ['./land-form.css'],
})
export class LandForm {
  @Output() continue = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();

  data = {
    cropType: '',
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

  sendData(form: NgForm) {
    if (form.invalid) {
      // إجبار إظهار الأخطاء للحقول التي لم يتفاعل معها المستخدم
      Object.keys(form.controls).forEach(field => {
        const control = form.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }

    // إرسال البيانات إذا كانت كل الحقول صالحة
    this.continue.emit(this.data);
  }
}
