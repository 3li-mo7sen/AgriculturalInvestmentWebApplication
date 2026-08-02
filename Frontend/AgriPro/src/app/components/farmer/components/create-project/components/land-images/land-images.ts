import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, NgZone, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-land-images',
  imports: [CommonModule],
  templateUrl: './land-images.html',
  styleUrls: ['./land-images.css'],
})
export class LandImages {
  @Output() continue = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();

  selectedFile: File | null = null;
  imagePreview: string | null = null;


  showError: boolean = false;
  errorMessage: string = '';

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      // 1. Validation للحجم (أقل من 10 ميجا)
      const maxSizeInMB = 10;
      if (file.size > maxSizeInMB * 1024 * 1024) {
        this.showError = true;
        this.errorMessage = 'Image size must not exceed 10MB.';
        this.selectedFile = null;
        this.imagePreview = null;
        return;
      }

      // 2. Validation للنوع (صور فقط)
      if (!file.type.startsWith('image/')) {
        this.showError = true;
        this.errorMessage = 'Please select a valid image file (PNG or JPG).';
        this.selectedFile = null;
        this.imagePreview = null;
        return;
      }

      // إخفاء الأخطاء إذا كانت الصورة سليمة
      this.showError = false;
      this.errorMessage = '';
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  sendData() {

    if (!this.selectedFile) {
      this.showError = true;
      this.errorMessage = 'Please upload a land image before continuing.';
      return;
    }

    this.showError = false;
   
    this.continue.emit({ Image: this.selectedFile });
  }
}
