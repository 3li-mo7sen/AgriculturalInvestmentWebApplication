import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-investor-settings',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './investor-settings.html',
  styleUrls: ['./investor-settings.css'],
})
export class InvestorSettings {

}
