import { Component } from '@angular/core';
import { ExpertVerifiedProjects } from './components/expert-verified-projects/expert-verified-projects';
import { ExpertVerifiedSearch } from './components/expert-verified-search/expert-verified-search';
import { ExpertVerifiedCards } from './components/expert-verified-cards/expert-verified-cards';

@Component({
  selector: 'app-expert-verified',
  imports: [ExpertVerifiedCards,ExpertVerifiedProjects,ExpertVerifiedSearch],
  templateUrl: './expert-verified.html',
  styleUrl: './expert-verified.css',
})
export class ExpertVerified {

}
