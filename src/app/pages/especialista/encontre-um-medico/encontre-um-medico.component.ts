import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppUtils } from 'src/app/core/utils/app.util';
import { DadosEspecialistaListaComponent } from 'src/app/pages/especialista/dados-especialista-lista/dados-especialista-lista.component';
import { EspecialistaResponse } from 'src/app/core/models/especialista/response/EspecialistaResponse';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { EspecialistaService } from 'src/app/core/services/especialista.service';
import { CryptoService } from 'src/app/shared/services/crypto.service';
@Component({
  selector: 'app-encontre-um-medico',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    DadosEspecialistaListaComponent
  ],
  templateUrl: './encontre-um-medico.component.html',
  styleUrl: './encontre-um-medico.component.css'
})
export class EncontreUmMedicoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private router = inject(Router);
  private cryptoService = inject(CryptoService);
  private notificationService = inject(NotificationService);
  private especialistaService = inject(EspecialistaService);

  especialistas: EspecialistaResponse[] = [];
  especialistasPaginadas: EspecialistaResponse[] = [];
  especialistasFiltradas: EspecialistaResponse[] = [];

  totalItems = 0;
  itemsPerPage = 15;
  currentPage = 1;
  termoBusca = '';

  showDemaisLocaisAtendimento: { [key: number]: boolean } = {};

  constructor() {
    this.obterListaEspecialistas();
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isNullOrEmpty(value: any): boolean {
    return AppUtils.isNullOrEmpty(value);
  }

  onclick_redirect_especialista_info(especialistaId: number) {
    this.router.navigate(['/especialista/'+ this.cryptoService.criptografar(especialistaId)]);
  }

  onclick_buscar_especialistas() {
    this.buscarEspecialistas();
  }

  onchange_search(): void {
    this.currentPage = 1; // Reseta para a primeira página a cada mudança na busca
    this.itemsPerPage = 15;
    const value = this.termoBusca?.trim();
    if (!value) {
      this.obterListaEspecialistas();   // ← volta para todas
      return;
    }
  //this.buscarEspecialistas();
  }

  obterListaEspecialistas() {
    this.especialistaService.getEspecialistasPaged(this.currentPage, this.itemsPerPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.especialistas = response.data.results
          this.totalItems = response.data.total;
        },
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      });
  }

  buscarEspecialistas() {
    if (!this.termoBusca.trim()) {
      this.currentPage = 1;
      this.obterListaEspecialistas();
      return;
    }

    const termoNormalizado = AppUtils.normalizarTexto(this.termoBusca);
    this.especialistaService.getEspecialistasByNamePaged(termoNormalizado, this.currentPage, this.itemsPerPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.especialistas = response.data.results
          this.totalItems = response.data.total;
        },
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      });
  }

  atualizarPaginaEvent(event: any) {
    this.currentPage = event.currentPage;
    this.itemsPerPage = event.itemsPerPage;

    if (this.isNullOrEmpty(this.termoBusca)) {
      this.obterListaEspecialistas();
    } else {
      this.buscarEspecialistas();
    }
  }
}
