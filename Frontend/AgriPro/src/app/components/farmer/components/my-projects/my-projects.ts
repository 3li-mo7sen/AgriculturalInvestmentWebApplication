import { Component } from '@angular/core';
import { ProjectCards } from './components/project-cards/project-cards';
import { ProjectLifecycle } from './components/project-lifecycle/project-lifecycle';

@Component({
  selector: 'app-my-projects',
  imports: [ProjectCards,ProjectLifecycle],
  templateUrl: './my-projects.html',
  styleUrl: './my-projects.css',
})
export class MyProjects {

}
