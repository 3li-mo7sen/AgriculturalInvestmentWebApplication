import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-investor-settings',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './investor-settings.html',
  styleUrl: './investor-settings.css',
})
export class InvestorSettings {

}
