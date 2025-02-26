import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  @Output() selected = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();
  //@Output() inputChange = new EventEmitter<string>(); // Novo evento


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
    //this.showDropdown = this.filteredItems.length > 0;
  }

  get showDropdown(): boolean {
    return this.searchTerm.trim() !== '' && this.filteredItems.length > 0;
  }

  filterItems() {
    this.filteredItems = this.items.filter(item =>
      this.displayFn ? this.displayFn(item).toLowerCase().includes(this.searchTerm.toLowerCase()) :
      item.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.search.emit(this.searchTerm);
    // if (this.searchTerm.length > 0) {

    //   this.filteredItems = this.items.filter(item =>
    //     this.displayFn
    //       ? this.displayFn(item).toLowerCase().includes(this.searchTerm.toLowerCase())
    //       : item.toLowerCase().includes(this.searchTerm.toLowerCase())
    //   );
    // } else {
    // }
    // this.inputChange.emit(this.searchTerm); // Emite quando o usuário apaga
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
    //this.showDropdown = false;
    this.filteredItems = [];
    this.selected.emit(item);
  }



}
