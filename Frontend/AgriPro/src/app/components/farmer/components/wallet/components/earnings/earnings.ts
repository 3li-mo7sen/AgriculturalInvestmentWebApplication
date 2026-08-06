import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-earnings',
  imports: [],
  templateUrl: './earnings.html',
  styleUrls: ['./earnings.css'],
})
export class Earnings {
  @Input() totalReturns: number = 0;
  @Input() pendingReturns: number = 0;

}
