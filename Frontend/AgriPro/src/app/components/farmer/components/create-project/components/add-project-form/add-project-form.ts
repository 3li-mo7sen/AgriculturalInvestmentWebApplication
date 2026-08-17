import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-add-project-form',
  imports: [FormsModule,CommonModule],
  templateUrl: './add-project-form.html',
  styleUrls: ['./add-project-form.css'],
})
export class AddProjectForm {
  //edit

  @Input() formData: any = {};



  @Output() continue = new EventEmitter<any>();

  /*
  
  data = {
  
  title: '',
  
  shortDescription: '',
  
  fullDescription: '',
  
  cropType: '',
  
  cost: null,
  
  expectedProfit: null,
  
  duration:null
  
  
  
  };
  
  */

  data = {

    title: '',

    shortDescription: '',

    fullDescription: '',

    cropType: '',

    cost: null as number | null,

    expectedProfit: null as number | null,

    duration: null as number | null

  };

  //edit

  cropOptions: string[] = [

    'Wheat',

    'Corn (Maize)',

    'Rice',

    'Cotton',

    'Sugarcane',

    'Sugar Beet',

    'Potatoes',

    'Tomatoes',

    'Onions',

    'Citrus (Oranges/Lemons)',

    'Grapes',

    'Dates',

    'Olives',

    'Strawberries',

    'Alfalfa (Berseem)',

    'Vegetables (Mixed)',

    'Other'

  ];

  //edit

  ngOnInit(): void {

    if (this.formData) {

      this.data = {

        title: this.formData.title || this.formData.Name || '',

        shortDescription: this.formData.shortDescription || this.formData.ShortDescription || '',

        fullDescription: this.formData.fullDescription || this.formData.FullDescription || '',

        cropType: this.formData.cropType || this.formData.CropType || '',

        cost: this.formData.cost ?? this.formData.Cost ?? null,

        expectedProfit: this.formData.expectedProfit ?? this.formData.ExpectedProfit ?? null,

        duration: this.formData.duration ?? this.formData.Duration ?? null

      };

    }

  }



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
