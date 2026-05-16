import { Component } from '@angular/core';
import { InvestProjectsProjects } from './components/invest-projects-projects/invest-projects-projects';
import { InvestProjectsSearch } from './components/invest-projects-search/invest-projects-search';
import { InvestProjectsRisk } from './components/invest-projects-risk/invest-projects-risk';

@Component({
  selector: 'app-investor-projects',
  imports: [InvestProjectsProjects,InvestProjectsRisk,InvestProjectsSearch],
  templateUrl: './investor-projects.html',
  styleUrls: ['./investor-projects.css'],
})
export class InvestorProjects {

}
