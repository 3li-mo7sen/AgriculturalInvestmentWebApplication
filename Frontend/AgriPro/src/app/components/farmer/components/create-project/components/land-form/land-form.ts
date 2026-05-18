import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-land-form',
  imports: [],
  templateUrl: './land-form.html',
  styleUrls: ['./land-form.css'],
})
export class LandForm {
  @Output() continue = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();

  data = {
    governorate: '',
    landSize: '',
    soilType: '',
    waterSource: '',
    ownershipType: ''
  };

  sendData() {
    this.continue.emit(this.data);
  }
}
