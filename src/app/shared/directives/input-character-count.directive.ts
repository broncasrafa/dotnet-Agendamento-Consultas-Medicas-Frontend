import { Directive, ElementRef, HostListener, Input, Renderer2, OnInit } from '@angular/core';


@Directive({
  selector: '[appInputCharacterCount]',
  standalone: true
})
export class InputCharacterCountDirective {
  @Input() maxLength!: number;
  private counterElement!: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    if (!this.maxLength) {
      console.warn('⚠️ [CharacterCountDirective] Nenhum maxLength foi definido.');
      return;
    }

    // Criar e adicionar contador de caracteres
    this.counterElement = this.renderer.createElement('small');
    this.renderer.setStyle(this.counterElement, 'display', 'block');
    this.renderer.setStyle(this.counterElement, 'color', '#888');
    this.renderer.setStyle(this.counterElement, 'font-size', '12px');
    this.renderer.appendChild(this.el.nativeElement.parentNode, this.counterElement);

    this.updateCounter();
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    if (target.value.length > this.maxLength) {
      target.value = target.value.substring(0, this.maxLength); // Impede ultrapassar o limite
    }
    this.updateCounter();
  }

  private updateCounter(): void {
    const remaining = this.maxLength - this.el.nativeElement.value.length;
    this.counterElement.textContent = `Caracteres restantes: ${remaining}`;
  }
}
