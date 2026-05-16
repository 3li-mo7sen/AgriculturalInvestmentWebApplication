import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-settings',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-settings.html',
  styleUrls: ['./admin-settings.css'],
})
export class AdminSettings {

}
