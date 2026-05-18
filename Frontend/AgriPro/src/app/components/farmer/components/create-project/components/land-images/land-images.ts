import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-land-images',
  imports: [],
  templateUrl: './land-images.html',
  styleUrls: ['./land-images.css'],
})
export class LandImages {
  @Output() continue = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
}
