import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading/loading.service';

@Component({
  standalone: true,
  selector: 'app-global-loader',
  imports: [CommonModule],
  templateUrl: './global-loader.html',
  styleUrls: ['./global-loader.css'],
})
export class GlobalLoader {

  isLoading = false;

  constructor(
    private _loadingService:LoadingService
  ) {

    this._loadingService.loading$.subscribe(value => {
      this.isLoading = value;
    })

  }



}



