import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-land-form',
  imports: [],
  templateUrl: './land-form.html',
  styleUrls: ['./land-form.css'],
})
export class LandForm {
  @Output() continue = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
}
