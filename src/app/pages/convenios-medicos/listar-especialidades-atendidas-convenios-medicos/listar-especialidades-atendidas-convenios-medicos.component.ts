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
import { CommonService } from 'src/app/core/services/common.service';
import { EspecialidadeResponse } from 'src/app/core/models/especialidade/response/EspecialidadeResponse';

@Component({
  selector: 'app-listar-especialidades-atendidas-convenios-medicos',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    PaginationComponent,
    ResultResponseEmptyComponent
  ],
  templateUrl: './listar-especialidades-atendidas-convenios-medicos.component.html',
  styleUrl: './listar-especialidades-atendidas-convenios-medicos.component.css'
})
export class ListarEspecialidadesAtendidasConveniosMedicosComponent  implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private cryptoService = inject(CryptoService);
  private notificationService = inject(NotificationService);
  private convenioMedicoService = inject(ConvenioMedicoService);
  private commonService = inject(CommonService);

  termoBusca = '';
  itemsPerPage = 15;
  currentPage = 1;
  totalItems = 0;
  convenioCode: string;
  cidadeCode: string;
  convenioMedicoId?: number;
  cidadeId?: number;

  convenioMedico: ConvenioMedicoResponse;
  cidade: CidadeResponse;
  especialidadesList: EspecialidadeResponse[] = [];
  especialidadesPaginadas: EspecialidadeResponse[] = [];
  especialidadesFiltradas: EspecialidadeResponse[] = [];

  constructor() {
    this.convenioCode = this.activatedRoute.snapshot.paramMap.get('convenioCode')!;
    this.cidadeCode = this.activatedRoute.snapshot.paramMap.get('cidadeCode')!;
    this.obterListaConveniosMedicos();
    this.obterListaCidades();

    if (!this.isNullOrUndefined(this.convenioMedicoId) && !this.isNullOrUndefined(this.cidadeId)) {
      this.obterListaEspecialidadesAtendidas();
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

  obterListaConveniosMedicos() {
    this.convenioMedicoService.getConveniosMedicos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.convenioMedico = response.find(x => x.code == this.convenioCode)!;
          this.convenioMedicoId = this.convenioMedico?.id;

          if (this.isNullOrUndefined(this.convenioMedicoId)) {
            this.router.navigate(['/404-page'])
          }

          this.convenioMedico
        },
        error: (err) => {
          this.notificationService.showHttpResponseErrorNotification(err);
        }
      });
  }
  obterListaCidades() {
    this.commonService.getCidades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.cidade = response.find(x => x.code == this.cidadeCode)!;
          this.cidadeId = this.cidade?.cidadeId;

          if (this.isNullOrUndefined(this.cidadeId)) {
            this.router.navigate(['/404-page'])
          }
        },
        error: (err) => {
          this.notificationService.showHttpResponseErrorNotification(err);
        }
      });
  }

  obterListaEspecialidadesAtendidas() {
    this.convenioMedicoService.getEspecialidadesByConvenioAndCidadePaged(this.convenioMedicoId!, this.cidadeId!, this.currentPage, this.itemsPerPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.especialidadesList = response.data!.results;
          this.totalItems = response.data!.total;

          // Começa com a lista completa
          this.especialidadesPaginadas = [...this.especialidadesList];
          // Carrega a primeira página
          //this.atualizarPagina(1, this.itemsPerPage);
        },
        error: (err) => {
          this.notificationService.showHttpResponseErrorNotification(err);
        }
      });
  }

  buscarEspecialidadesAtendidas() {
    if (this.termoBusca.trim() === '') {
      this.resetarBusca();
    } else {
      const termoNormalizado = AppUtils.normalizarTexto(this.termoBusca);
      // Filtra a lista completa com base no termo de busca
      this.especialidadesFiltradas = this.especialidadesList.filter(esp =>
        AppUtils.normalizarTexto(esp.nome).includes(termoNormalizado)
      );

      // Atualiza o total de itens e reseta para a primeira página
      this.currentPage = 1;
      this.totalItems = this.especialidadesFiltradas.length;
      this.atualizarPagina(this.currentPage, this.itemsPerPage, true);
    }
  }

  atualizarPagina(page: number, pageSize: number, isFromBusca = false) {
    this.currentPage = Number(page);
    this.itemsPerPage = Number(pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    // // Filtro da página atual
    if (isFromBusca) this.especialidadesPaginadas = this.especialidadesFiltradas.slice(startIndex, endIndex);

    if (!isFromBusca) this.obterListaEspecialidadesAtendidas();
  }

  resetarBusca() {
    // Se a busca for apagada, volta para a lista completa
    this.especialidadesFiltradas = [...this.especialidadesList];
    this.totalItems = this.especialidadesFiltradas.length;
    this.currentPage = 1;
    this.itemsPerPage = 15;
    this.atualizarPagina(this.currentPage, this.itemsPerPage);
  }

  onSearchIsBecomedEmpty() {
    if (this.termoBusca.trim() === '') {
      this.resetarBusca();
    }
  }

  onclick_redirect_especialidades_detalhes(term: string) {
    this.router.navigate([`/especialidades/${term}/especialistas`])
  }
}

