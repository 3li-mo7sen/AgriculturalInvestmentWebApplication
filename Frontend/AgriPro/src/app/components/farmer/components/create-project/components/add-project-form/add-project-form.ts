import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-add-project-form',
  imports: [FormsModule,CommonModule],
  templateUrl: './add-project-form.html',
  styleUrls: ['./add-project-form.css'],
})
export class AddProjectForm {
 
 

  @Output() continue = new EventEmitter<any>();

  data = {
    title: '',
    shortDescription: '',
    fullDescription: '',
    cropType: '',
    cost: null,
    expectedProfit: null,
    duration:null

  };

  sendData(form: NgForm) {
    if (form.invalid) {
     
      Object.keys(form.controls).forEach(field => {
        const control = form.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }

  
    this.continue.emit(this.data);
  }
}
