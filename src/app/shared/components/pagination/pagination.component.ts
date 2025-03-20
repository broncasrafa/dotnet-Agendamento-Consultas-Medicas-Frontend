import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  @Input() totalItems = 0; // Total de itens na API
  @Input() itemsPerPage = 10; // Itens por página (default: 10)
  @Output() pageChanged = new EventEmitter<{ page: number; pageSize: number }>();

  currentPage = 1;

  itemsPerPageOptions = [5, 10, 20, 50, 100];

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endItem(): number {
    return Math.min(this.startItem + this.itemsPerPage - 1, this.totalItems);
  }

  changePageSize(size: number) {
    this.itemsPerPage = size;
    this.currentPage = 1;
    this.emitChange();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.emitChange();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.emitChange();
    }
  }

  private emitChange() {
    this.pageChanged.emit({ page: this.currentPage, pageSize: this.itemsPerPage });
  }
}
