import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { AppUtils } from 'src/app/core/utils/app.util';
import { EspecialidadeResponse } from 'src/app/core/models/especialidade/response/EspecialidadeResponse';

@Component({
  selector: 'app-dropdown-pesquisar-especialidades',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dropdown-pesquisar-especialidades.component.html',
  styleUrl: './dropdown-pesquisar-especialidades.component.css'
})
export class DropdownPesquisarEspecialidadesComponent {
@Input() placeholder: string = 'Digite para buscar...';
  @Input() items: EspecialidadeResponse[] = [];
  @Input() displayFn?: (item: any) => string;
  @Input() showButtonForMoreEspecialidades: boolean = true;
  @Output() selected = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();

  @ViewChild('searchInput') searchInput!: ElementRef;

  searchTerm: string = '';
  filteredItems: any[] = [];
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
      return AppUtils.normalizarTexto(itemText.toString()).includes(normalizedSearch);
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

  take(lista: EspecialidadeResponse[], count: number) {
    return AppUtils.take(lista, count);
  }
}
