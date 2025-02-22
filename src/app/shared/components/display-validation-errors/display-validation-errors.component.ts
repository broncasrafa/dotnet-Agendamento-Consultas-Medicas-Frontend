import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-display-validation-errors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-validation-errors.component.html',
  styleUrl: './display-validation-errors.component.css'
})
export class DisplayValidationErrorsComponent implements OnInit, OnChanges {

  @Input() control: any;

  constructor() { }

  ngOnInit() {
    //console.log('[CONTROL onInit]: ', this.control);
  }
  ngOnChanges() {
    //console.log('[CONTROL onChanges]: ', this.control);
  }

}
