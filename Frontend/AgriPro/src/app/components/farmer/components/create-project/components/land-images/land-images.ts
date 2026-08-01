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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      console.log('image is uploaded successfully', this.selectedFile);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  sendData() {
    // بنبعت الملف تحت اسم Image تماماً زي ما في الـ Swagger
    this.continue.emit({ image: this.selectedFile });
  }
}
