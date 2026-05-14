import { Component } from '@angular/core';
import { ExpertRejectedCards } from './components/expert-rejected-cards/expert-rejected-cards';
import { ExpertRejectedList } from './components/expert-rejected-list/expert-rejected-list';
import { ExpertRejectedSearch } from './components/expert-rejected-search/expert-rejected-search';

@Component({
  selector: 'app-expert-rejected',
  imports: [ExpertRejectedCards,ExpertRejectedList,ExpertRejectedSearch],
  templateUrl: './expert-rejected.html',
  styleUrl: './expert-rejected.css',
})
export class ExpertRejected {

}
