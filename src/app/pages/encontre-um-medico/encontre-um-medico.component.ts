import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppUtils } from 'src/app/core/utils/app.util';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { RatingStarsComponent } from 'src/app/shared/components/rating-stars/rating-stars.component';
import { EspecialistaResponse } from 'src/app/core/models/especialista/response/EspecialistaResponse';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { EspecialistaService } from 'src/app/core/services/especialista.service';
import { AddressFormattedPipe } from 'src/app/shared/pipes/address-formatted.pipe';
import { EspecialistaLocalAtendimentoResponse } from 'src/app/core/models/especialista/response/LocaisAtendimentoResponse';

@Component({
  selector: 'app-encontre-um-medico',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    PaginationComponent,
    RatingStarsComponent,
    AddressFormattedPipe
  ],
  templateUrl: './encontre-um-medico.component.html',
  styleUrl: './encontre-um-medico.component.css'
})
export class EncontreUmMedicoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthenticationService);
  private notificationService = inject(NotificationService);
  private especialistaService = inject(EspecialistaService);

  especialistas: EspecialistaResponse[] = [];
  especialistasPaginadas: EspecialistaResponse[] = [];
  especialistasFiltradas: EspecialistaResponse[] = [];

  totalItems = 0;
  itemsPerPage = 10;
  currentPage = 1;
  termoBusca = '';

  showDemaisLocaisAtendimento: { [key: number]: boolean } = {};

  constructor() {
    this.obterListaEspecialistas();
  }

  ngOnInit(): void {
    this.totalItems = this.especialistas.length;
    this.atualizarPagina(1, this.itemsPerPage); // Carrega a primeira página

    // // Assume que a lista já foi carregada do cache
    // this.especialidadesFiltradas = [...this.especialidades]; // Começa com a lista completa
    // this.totalItems = this.especialidadesFiltradas.length;

    // // Carrega a primeira página
    this.atualizarPagina(1, this.itemsPerPage);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isNullOrUndefined(value: any): boolean {
    return AppUtils.isNullOrUndefined(value);
  }
  isNullOrEmpty(value: any): boolean {
    return AppUtils.isNullOrEmpty(value);
  }
  take(collection: any[], count: number) {
    return AppUtils.take(collection, count);
  }
  skip(collection: any[], count: number) {
    return AppUtils.skip(collection, count);
  }

  isLoadedDataInit() {
    return !AppUtils.isNullOrUndefined(this.especialistas);
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

  mostrarMaisLocaisAtendimento(especialistaId: number) {
    this.showDemaisLocaisAtendimento[especialistaId] = !this.showDemaisLocaisAtendimento[especialistaId];
  }



  atualizarPagina(page: number, pageSize: number) {
    this.currentPage = page;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Filtro da página atual
    this.especialistasPaginadas = this.especialistasFiltradas.slice(startIndex, endIndex);
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




    // if (this.termoBusca.trim() === '') {
    //   this.resetarBusca();
    // } else {
    //   const termoNormalizado = AppUtils.normalizarTexto(this.termoBusca);

    //   // Filtra a lista completa com base no termo de busca
    //   this.especialidadesFiltradas = this.especialidades.filter(especialidade =>
    //     AppUtils.normalizarTexto(especialidade.nome).includes(termoNormalizado)
    //   );

    //   // Atualiza o total de itens e reseta para a primeira página
    //   this.totalItems = this.especialidadesFiltradas.length;
    //   this.currentPage = 1;
    //   this.atualizarPagina(this.currentPage, this.itemsPerPage);
    // }
  }


  onPageChanged(event: { page: number; pageSize: number }): void {
    this.currentPage = Number(event.page);
    this.itemsPerPage = Number(event.pageSize);

    if (this.termoBusca.trim()) {
      this.buscarEspecialistas();
    } else {
      this.obterListaEspecialistas();
    }
  }


  resetarBusca() {
    // Se a busca for apagada, volta para a lista completa
    this.especialistasFiltradas = [...this.especialistas];
    this.totalItems = this.especialistasFiltradas.length;
    this.currentPage = 1;
    this.atualizarPagina(this.currentPage, this.itemsPerPage);
  }

  onRedirect_Especialistas(term: string) {
    this.router.navigate(['/especialista/' + term])
  }
}
