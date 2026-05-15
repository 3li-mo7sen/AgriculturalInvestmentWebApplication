import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-expert-settings',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './expert-settings.html',
  styleUrls: ['./expert-settings.css'],
})
export class ExpertSettings {

}
