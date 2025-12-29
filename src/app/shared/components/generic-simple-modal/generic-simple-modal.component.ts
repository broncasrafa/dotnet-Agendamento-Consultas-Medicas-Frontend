import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

//type ModalSize = '' | 'sm' | 'lg' | 'xl';

export class ModalSize {
  static readonly DEFAULT = '';
  static readonly SMALL = 'sm';
  static readonly MEDIUM = 'md';
  static readonly LARGE = 'lg';
  static readonly EXTRA_LARGE = 'xl';
}

@Component({
  selector: 'app-generic-simple-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-simple-modal.component.html',
  styleUrl: './generic-simple-modal.component.css'
})
export class GenericSimpleModalComponent {
  @Input() modalId!: string; // obrigatório para data-bs-target
  @Input() title: string = '';
  @Input() size: string = ModalSize.DEFAULT; // '' | 'sm' | 'md' | 'lg' | 'xl' => gera: modal-sm, modal-md, modal-lg, modal-xl
  @Input() scrollable: boolean = false;
  @Input() showFooter: boolean = true;
  @Input() showCloseButton: boolean = true;
  @Input() closeText: string = 'Fechar';
  @Input() showPrimaryButton: boolean = false;
  @Input() primaryText: string = 'Salvar';

  readonly ModalSize = ModalSize;

  get modalDialogClasses(): string {
    if (!this.size) {
      return 'modal-dialog modal-dialog-centered modal-md';
    }

    const classes = `modal-dialog modal-dialog-centered modal-${this.size}`;

    if (this.scrollable) {
      return `${classes} modal-dialog-scrollable`;
    }

    return classes;
  }
}
