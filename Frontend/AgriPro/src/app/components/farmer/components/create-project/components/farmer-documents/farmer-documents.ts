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

  // المتغيرات لتخزين الملفات الأربعة
  landOwnershipDoc: File | null = null;
  nationalIdDoc: File | null = null;
  agriculturalPermitDoc: File | null = null;
  waterRightsDoc: File | null = null;

  // ميثود التعامل مع اختيار الملفات حسب النوع
  onFileSelected(event: any, docType: string) {
    const file = event.target.files[0];
    if (file) {
      if (docType === 'land') this.landOwnershipDoc = file;
      if (docType === 'id') this.nationalIdDoc = file;
      if (docType === 'permit') this.agriculturalPermitDoc = file;
      if (docType === 'water') this.waterRightsDoc = file;
    }
  }

  // إرسال البيانات بأسماء الحقول المطلوبة بالضبط في الـ Swagger
  sendData() {
    this.continue.emit({
      LandOwnershipDoc: this.landOwnershipDoc,
      NationalIdDoc: this.nationalIdDoc,
      AgriculturalPermitDoc: this.agriculturalPermitDoc,
      WaterRightsDoc: this.waterRightsDoc,
    });
  }
}
