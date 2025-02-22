import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-display-validation-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-validation-messages.component.html',
  styleUrl: './display-validation-messages.component.css'
})
export class DisplayValidationMessagesComponent {
  @Input() errorMessages: string[] | undefined;
}
