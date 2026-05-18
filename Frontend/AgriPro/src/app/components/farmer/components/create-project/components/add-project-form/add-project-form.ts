import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-add-project-form',
  imports: [FormsModule],
  templateUrl: './add-project-form.html',
  styleUrls: ['./add-project-form.css'],
})
export class AddProjectForm {
 
 

  @Output() continue = new EventEmitter<any>();

  data = {
    title: '',
    shortDescription: '',
    fullDescription: '',
    cropType: ''
  };

  sendData() {
    this.continue.emit(this.data);
  }
}
