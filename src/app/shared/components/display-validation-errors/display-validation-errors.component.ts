import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-display-validation-errors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-validation-errors.component.html',
  styleUrl: './display-validation-errors.component.css'
})
export class DisplayValidationErrorsComponent {

  @Input() control!: any;
  @Input() formGroupDirective!: FormGroupDirective; // Recebe a diretiva do formulário para acessar o estado de submissão

  get shouldShowErrors(): boolean {
    return this.control && this.control.invalid &&
      (this.control.dirty || this.control.touched || this.formGroupDirective.submitted);
  }
}
