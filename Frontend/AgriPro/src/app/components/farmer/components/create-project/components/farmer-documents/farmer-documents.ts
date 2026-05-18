import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-farmer-documents',
  imports: [],
  templateUrl: './farmer-documents.html',
  styleUrls: ['./farmer-documents.css'],
})
export class FarmerDocuments {
  @Output() continue = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
}
