import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AppUtils } from 'src/app/core/utils/app.util';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { FilterByLetterComponent } from 'src/app/shared/components/filter-by-letter/filter-by-letter.component';
import { ResultResponseEmptyComponent } from 'src/app/shared/components/result-response-empty/result-response-empty.component';
import { CryptoService } from 'src/app/shared/services/crypto.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SintomasEDoencasService } from 'src/app/core/services/sintomas-e-doencas.service';
import { SintomasDoencasResponse } from 'src/app/core/models/sintomas-e-doencas/response/SintomasDoencasResponse';

@Component({
  selector: 'app-listar-sintomas-e-doencas',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    PaginationComponent,
    ResultResponseEmptyComponent,
    FilterByLetterComponent
  ],
  templateUrl: './listar-sintomas-e-doencas.component.html',
  styleUrl: './listar-sintomas-e-doencas.component.css'
})
export class ListarSintomasEDoencasComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private router = inject(Router);
  private cryptoService = inject(CryptoService);
  private notificationService = inject(NotificationService);
  private sintomasDoencasService = inject(SintomasEDoencasService);

  termoBusca = '';
  itemsPerPage = 15;
  currentPage = 1;
  totalItems = 0;
  selectedLetter = '';
  sintomasDoencasList: SintomasDoencasResponse[] = [];
  sintomasDoencasPaginadas: SintomasDoencasResponse[] = [];
  sintomasDoencasFiltradas: SintomasDoencasResponse[] = [];

  constructor() {
    this.obterListaSintomasDoencas();
  }

  ngOnInit(): void {
    // Assume que a lista já foi carregada do cache
    this.sintomasDoencasFiltradas = [...this.sintomasDoencasList]; // Começa com a lista completa
    this.totalItems = this.sintomasDoencasFiltradas.length;
    // Carrega a primeira página
    this.atualizarPagina(1, this.itemsPerPage);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isArrayNullOrEmpty(value: any[]): boolean {
    return AppUtils.isArrayNullOrEmpty<any>(value);
  }

  obterListaSintomasDoencas() {
    this.sintomasDoencasService.getSintomasDoencasCache()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.sintomasDoencasList = response;
          this.totalItems = response.length;
        },
        error: (err) => {
          this.notificationService.showHttpResponseErrorNotification(err);
        }
      });
  }

  buscarSintomasDoencas() {
    if (this.termoBusca.trim() === '') {
      this.resetarBusca();
    } else {
      this.selectedLetter = '';
      const termoNormalizado = AppUtils.normalizarTexto(this.termoBusca);
      // Filtra a lista completa com base no termo de busca
      this.sintomasDoencasFiltradas = this.sintomasDoencasList.filter(sintoma =>
        AppUtils.normalizarTexto(sintoma.nome).includes(termoNormalizado)
      );

      // Atualiza o total de itens e reseta para a primeira página
      this.totalItems = this.sintomasDoencasFiltradas.length;
      this.currentPage = 1;
      this.atualizarPagina(this.currentPage, this.itemsPerPage);
    }
  }

  atualizarPagina(page: number, pageSize: number) {
    this.currentPage = Number(page);
    this.itemsPerPage = Number(pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    // Filtro da página atual
    this.sintomasDoencasPaginadas = this.sintomasDoencasFiltradas.slice(startIndex, endIndex);
  }

  resetarBusca() {
    // Se a busca for apagada, volta para a lista completa
    this.sintomasDoencasFiltradas = [...this.sintomasDoencasList];
    this.totalItems = this.sintomasDoencasFiltradas.length;
    this.currentPage = 1;
    this.itemsPerPage = 15;
    this.selectedLetter = '';
    this.atualizarPagina(this.currentPage, this.itemsPerPage);
  }

  onSearchIsBecomedEmpty() {
    if (this.termoBusca.trim() === '') {
      this.resetarBusca();
    }
  }

  onclick_redirect_sintomasDoencas_detalhes(id: number) {
    this.router.navigate(['/sintomas-e-doencas/'+ this.cryptoService.criptografar(id) ])
  }

  letter_selected_emitted(event: any) {
    if (!AppUtils.isNullOrEmpty(event.selected)) {
      this.selectedLetter = event.selected;
      // Filtra a lista completa com base na letra
      this.sintomasDoencasFiltradas = this.sintomasDoencasList.filter(x => x.nome?.charAt(0).toUpperCase() === event.selected);
      // Atualiza o total de itens e reseta para a primeira página
      this.totalItems = this.sintomasDoencasFiltradas.length;
      this.currentPage = 1;
      this.itemsPerPage = 15;
      this.atualizarPagina(this.currentPage, this.itemsPerPage);
    } else {
      this.resetarBusca()
    }
  }
}
