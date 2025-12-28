import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppUtils } from 'src/app/core/utils/app.util';

@Component({
  selector: 'app-autocomplete-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './autocomplete-search.component.html',
  styleUrl: './autocomplete-search.component.css'
})
export class AutocompleteSearchComponent {
  @Input() placeholder: string = 'Digite para buscar...';
  @Input() items: any[] = [];
  @Input() displayFn?: (item: any) => string;
  @Input() displayIcone: boolean = false;
  @Input() srcIcone: string = '../../../assets/img/logo_1.png';

  @Output() selected = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();

  @ViewChild('searchInput') searchInput!: ElementRef;

  searchTerm: string = '';
  filteredItems: any[] = [];
  // showDropdown = false;
  highlightedIndex = -1;

  ngOnInit() {
    this.filteredItems = [...this.items];
  }

  ngOnChanges() {
    this.filteredItems = this.items;
  }

  get showDropdown(): boolean {
    return this.searchTerm.trim() !== '' && this.filteredItems.length > 0;
  }

  filterItems() {
    const normalizedSearch = AppUtils.normalizarTexto(this.searchTerm);

    this.filteredItems = this.items.filter(item => {
      const itemText = this.displayFn ? this.displayFn(item) : item;
      return AppUtils.normalizarTexto(itemText).includes(normalizedSearch);
    });

    this.search.emit(this.searchTerm);
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      this.highlightedIndex = (this.highlightedIndex + 1) % this.filteredItems.length;
    } else if (event.key === 'ArrowUp') {
      this.highlightedIndex = (this.highlightedIndex - 1 + this.filteredItems.length) % this.filteredItems.length;
    } else if (event.key === 'Enter' && this.highlightedIndex > -1) {
      this.selectItem(this.filteredItems[this.highlightedIndex]);
      event.preventDefault();
    } else if (event.key === 'Escape') {
      this.filteredItems = [];
    }
  }

  selectItem(item: any) {
    this.searchTerm = this.displayFn ? this.displayFn(item) : item;
    this.filteredItems = [];
    this.selected.emit(item);
  }

  // Método para limpar o campo
  clear(): void {
    this.searchTerm = '';
    this.filteredItems = [];
    this.highlightedIndex = -1;
    // como o input está com [(ngModel)]="searchTerm",
    // o valor visual some automaticamente
  }

}
