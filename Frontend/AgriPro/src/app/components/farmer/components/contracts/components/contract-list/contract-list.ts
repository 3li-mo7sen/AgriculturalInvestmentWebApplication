import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-contract-list',
  imports: [CommonModule],
  templateUrl: './contract-list.html',
  styleUrls: ['./contract-list.css'],
})
export class ContractList {
  @Input() contracts: any[] = [];

}
