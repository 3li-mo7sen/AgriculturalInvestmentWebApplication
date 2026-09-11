import { Component } from '@angular/core';
import { ProjectsCards } from './components/projects-cards/projects-cards';
import { ProjectsSearch } from './components/projects-search/projects-search';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-projects',
  imports: [ProjectsCards,ProjectsSearch,Navbar,Footer],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {

}
