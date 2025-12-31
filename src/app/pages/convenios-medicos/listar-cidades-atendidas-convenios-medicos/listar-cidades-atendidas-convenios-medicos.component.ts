import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { CidadeResponse } from 'src/app/core/models/common/request/CidadeResponse';


@Component({
  selector: 'app-listar-cidades-atendidas-convenios-medicos',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    PaginationComponent,
    ResultResponseEmptyComponent
  ],
  templateUrl: './listar-cidades-atendidas-convenios-medicos.component.html',
  styleUrl: './listar-cidades-atendidas-convenios-medicos.component.css'
})
export class ListarCidadesAtendidasConveniosMedicosComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private cryptoService = inject(CryptoService);
  private notificationService = inject(NotificationService);
  private convenioMedicoService = inject(ConvenioMedicoService);

  termoBusca = '';
  itemsPerPage = 15;
  currentPage = 1;
  totalItems = 0;
  convenioCode: string;
  convenioMedicoId?: number;
  convenioMedico: ConvenioMedicoResponse;
  cidadesAtendidasList: CidadeResponse[] = [];
  cidadesAtendidasPaginadas: CidadeResponse[] = [];
  cidadesAtendidasFiltradas: CidadeResponse[] = [];

  constructor() {
    // const id = this.activatedRoute.snapshot.paramMap.get('id');
    // this.convenioMedicoId = this.cryptoService.descriptografar(id!);
    this.convenioCode = this.activatedRoute.snapshot.paramMap.get('convenioCode')!;
    this.obterListaConveniosMedicos();

    if (!this.isNullOrUndefined(this.convenioMedicoId)) {
      this.obterDadosConvenioMedico();
    }


  }

  ngOnInit(): void {

  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isNullOrUndefined(value: any): boolean {
    return AppUtils.isNullOrUndefined(value);
  }
  isArrayNullOrEmpty(value: any[]): boolean {
    return AppUtils.isArrayNullOrEmpty<any>(value);
  }

  obterDadosConvenioMedico() {
    this.convenioMedicoService.getCidadesAtendidasConveniosMedicos(this.convenioMedicoId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.convenioMedico = response;
          this.cidadesAtendidasList = response.cidadesAtendidas;
          this.totalItems = response.cidadesAtendidas.length;

          // Começa com a lista completa
          this.cidadesAtendidasFiltradas = [...this.cidadesAtendidasList];
          this.totalItems = this.cidadesAtendidasFiltradas.length;
          // Carrega a primeira página
          this.atualizarPagina(1, this.itemsPerPage);
        },
        error: (err) => {
          this.notificationService.showHttpResponseErrorNotification(err);
        }
      });
  }
  obterListaConveniosMedicos() {
    this.convenioMedicoService.getConveniosMedicos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.convenioMedicoId = response.find(x => x.code == this.convenioCode)?.id;

          if (this.isNullOrUndefined(this.convenioMedicoId)) {
            this.router.navigate(['/404-page'])
          }
        },
        error: (err) => {
          this.notificationService.showHttpResponseErrorNotification(err);
        }
      });
  }

  buscarCidadesAtendidas() {
    if (this.termoBusca.trim() === '') {
      this.resetarBusca();
    } else {
      const termoNormalizado = AppUtils.normalizarTexto(this.termoBusca);
      // Filtra a lista completa com base no termo de busca
      this.cidadesAtendidasFiltradas = this.cidadesAtendidasList.filter(cidade =>
        AppUtils.normalizarTexto(cidade.descricao).includes(termoNormalizado)
      );

      // Atualiza o total de itens e reseta para a primeira página
      this.currentPage = 1;
      this.totalItems = this.cidadesAtendidasFiltradas.length;
      this.atualizarPagina(this.currentPage, this.itemsPerPage);
    }
  }

  atualizarPagina(page: number, pageSize: number) {
    this.currentPage = Number(page);
    this.itemsPerPage = Number(pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    // Filtro da página atual
    this.cidadesAtendidasPaginadas = this.cidadesAtendidasFiltradas.slice(startIndex, endIndex);
  }

  resetarBusca() {
    // Se a busca for apagada, volta para a lista completa
    this.cidadesAtendidasFiltradas = [...this.cidadesAtendidasList];
    this.totalItems = this.cidadesAtendidasFiltradas.length;
    this.currentPage = 1;
    this.itemsPerPage = 15;
    this.atualizarPagina(this.currentPage, this.itemsPerPage);
  }

  onSearchIsBecomedEmpty() {
    if (this.termoBusca.trim() === '') {
      this.resetarBusca();
    }
  }

  onclick_redirect_cidadesAtendidas_detalhes(code: string) {
    this.router.navigate([`/convenios-medicos/${this.convenioCode}/cidades/${code}/especialidades` ])
  }
}
