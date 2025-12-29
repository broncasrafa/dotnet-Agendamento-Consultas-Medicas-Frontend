import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface AlphabetSelection {
  selected: string;
}

@Component({
  selector: 'app-filter-by-letter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-by-letter.component.html',
  styleUrl: './filter-by-letter.component.css'
})
export class FilterByLetterComponent {

  @Input() selectedLetter: string = '';
  @Output() selectionChanged = new EventEmitter<AlphabetSelection>();

  letters: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  onSelect(letter: string): void {
    if (this.selectedLetter === letter) {
      // clicou na mesma letra -> desmarca
      this.selectedLetter = '';
    } else {
      this.selectedLetter = letter;
    }

    this.selectionChanged.emit({ selected: this.selectedLetter });
  }
}
