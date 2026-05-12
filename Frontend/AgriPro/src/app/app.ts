import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { GlobalLoader } from './components/global-loader/global-loader';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet,GlobalLoader],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  protected readonly title = signal('AgriPro');

  constructor(
    private _authService:AuthService
  ) { }
  ngOnInit() {
    this._authService.decodeToken();
  }
}



