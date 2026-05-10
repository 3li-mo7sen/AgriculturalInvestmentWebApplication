import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading/loading.service';

@Component({
  selector: 'app-global-loader',
  imports: [CommonModule],
  templateUrl: './global-loader.html',
  styleUrl: './global-loader.css',
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
