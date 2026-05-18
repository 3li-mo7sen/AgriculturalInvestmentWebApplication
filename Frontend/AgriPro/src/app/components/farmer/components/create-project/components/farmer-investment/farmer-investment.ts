import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-farmer-investment',
  imports: [],
  templateUrl: './farmer-investment.html',
  styleUrls: ['./farmer-investment.css'],
})
export class FarmerInvestment {
  @Output() previous = new EventEmitter<void>();
}
