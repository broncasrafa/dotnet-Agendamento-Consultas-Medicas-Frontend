import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AppUtils } from 'src/app/core/utils/app.util';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { ResultResponseEmptyComponent } from 'src/app/shared/components/result-response-empty/result-response-empty.component';
import { CryptoService } from 'src/app/shared/services/crypto.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ConvenioMedicoService } from 'src/app/core/services/convenio-medico.service';
import { ConvenioMedicoResponse } from 'src/app/core/models/convenio-medico/response/ConvenioMedicoResponse';

@Component({
  selector: 'app-listar-convenios-medicos',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    PaginationComponent,
    ResultResponseEmptyComponent
  ],
  templateUrl: './listar-convenios-medicos.component.html',
  styleUrl: './listar-convenios-medicos.component.css'
})
export class ListarConveniosMedicosComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private router = inject(Router);
  private cryptoService = inject(CryptoService);
  private notificationService = inject(NotificationService);
  private convenioMedicoService = inject(ConvenioMedicoService);

  termoBusca = '';
  itemsPerPage = 15;
  currentPage = 1;
  totalItems = 0;
  conveniosMedicosList: ConvenioMedicoResponse[] = [];
  conveniosMedicosPaginadas: ConvenioMedicoResponse[] = [];
  conveniosMedicosFiltradas: ConvenioMedicoResponse[] = [];

  constructor() {
    this.obterListaConveniosMedicos();
  }

  ngOnInit(): void {
    // Assume que a lista já foi carregada do cache
    this.conveniosMedicosFiltradas = [...this.conveniosMedicosList]; // Começa com a lista completa
    this.totalItems = this.conveniosMedicosFiltradas.length;
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

  obterListaConveniosMedicos() {
    this.convenioMedicoService.getConveniosMedicos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.conveniosMedicosList = response;
          this.totalItems = response.length;
        },
        error: (err) => {
          this.notificationService.showHttpResponseErrorNotification(err);
        }
      });
  }

  buscarConveniosMedicos() {
    if (this.termoBusca.trim() === '') {
      this.resetarBusca();
    } else {
      const termoNormalizado = AppUtils.normalizarTexto(this.termoBusca);
      // Filtra a lista completa com base no termo de busca
      this.conveniosMedicosFiltradas = this.conveniosMedicosList.filter(sintoma =>
        AppUtils.normalizarTexto(sintoma.nome).includes(termoNormalizado)
      );

      // Atualiza o total de itens e reseta para a primeira página
      this.currentPage = 1;
      this.totalItems = this.conveniosMedicosFiltradas.length;
      this.atualizarPagina(this.currentPage, this.itemsPerPage);
    }
  }

  atualizarPagina(page: number, pageSize: number) {
    this.currentPage = Number(page);
    this.itemsPerPage = Number(pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    // Filtro da página atual
    this.conveniosMedicosPaginadas = this.conveniosMedicosFiltradas.slice(startIndex, endIndex);
  }

  resetarBusca() {
    // Se a busca for apagada, volta para a lista completa
    this.conveniosMedicosFiltradas = [...this.conveniosMedicosList];
    this.totalItems = this.conveniosMedicosFiltradas.length;
    this.currentPage = 1;
    this.itemsPerPage = 15;
    this.atualizarPagina(this.currentPage, this.itemsPerPage);
  }

  onSearchIsBecomedEmpty() {
    if (this.termoBusca.trim() === '') {
      this.resetarBusca();
    }
  }

  onclick_redirect_conveniosMedicos_detalhes(id: number) {
    this.router.navigate(['/convenios-medicos/'+ this.cryptoService.criptografar(id) ])
  }
}

