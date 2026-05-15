import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-expert-verified-search',
  imports: [CommonModule],
  templateUrl: './expert-verified-search.html',
  styleUrls: ['./expert-verified-search.css'],
})
export class ExpertVerifiedSearch {
  crops = ['All Crops', 'Wheat', 'Vegetables', 'Rice', 'Fruits', 'Cotton', 'Sugarcane'];
}
