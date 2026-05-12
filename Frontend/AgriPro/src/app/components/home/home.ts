import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Footer } from './components/footer/footer';
import { Navbar } from './components/navbar/navbar';
import { Hero } from './components/hero/hero';
import { HowItWorks } from './components/how-it-works/how-it-works';
import { Testimonals } from './components/testimonals/testimonals';
import { Features } from './components/features/features';
import { ProjectList } from './components/project-list/project-list';


@Component({
  standalone: true,
  selector: 'app-home',
  imports: [Navbar,Hero,HowItWorks,Features,ProjectList,Testimonals,Footer],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  constructor(
    private _authService:AuthService
  ) { }

  logout() {
    this._authService.logout();
  }
}




