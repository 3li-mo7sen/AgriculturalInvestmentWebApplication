import { Component } from '@angular/core';
import { IconsRaw } from './components/icons-raw/icons-raw';
import { AddProjectForm } from './components/add-project-form/add-project-form';

@Component({
  standalone: true,
  selector: 'app-create-project',
  imports: [IconsRaw, AddProjectForm],
  templateUrl: './create-project.html',
  styleUrls: ['./create-project.css'],
})
export class CreateProject {

}
