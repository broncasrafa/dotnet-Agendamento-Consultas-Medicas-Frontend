import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { EspecialidadeResponse } from 'src/app/core/models/especialidade/response/EspecialidadeResponse';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { EspecialidadeService } from 'src/app/core/services/especialidade.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { AppUtils } from 'src/app/core/utils/app.util';

@Component({
  selector: 'app-listar-especialidades',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    PaginationComponent
  ],
  templateUrl: './listar-especialidades.component.html',
  styleUrl: './listar-especialidades.component.css'
})
export class ListarEspecialidadesComponent  implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthenticationService);
  private notificationService = inject(NotificationService);
  private especialidadeService = inject(EspecialidadeService);

  especialidades: EspecialidadeResponse[] = []; // Lista completa ja carregada pelo cache
  especialidadesPaginadas: EspecialidadeResponse[] = []; // Lista paginada (10 registros por vez)
  especialidadesFiltradas: EspecialidadeResponse[] = []; // Lista filtrada após a busca

  totalItems = 0;
  itemsPerPage = 12;
  currentPage = 1;
  termoBusca = '';

  constructor() {
    this.obterListaEspecialidades();
  }

  ngOnInit(): void {
    // this.totalItems = this.especialidades.length;
    // this.atualizarPagina(1, this.itemsPerPage); // Carrega a primeira página

    // Assume que a lista já foi carregada do cache
    this.especialidadesFiltradas = [...this.especialidades]; // Começa com a lista completa
    this.totalItems = this.especialidadesFiltradas.length;

    // Carrega a primeira página
    this.atualizarPagina(1, this.itemsPerPage);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  obterListaEspecialidades() {
    this.especialidadeService.getEspecialidades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.especialidades = response,
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      });
  }

  atualizarPagina(page: number, pageSize: number) {
    this.currentPage = page;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Filtro da página atual
    // this.especialidadesPaginadas = this.especialidades.slice(startIndex, endIndex);
    this.especialidadesPaginadas = this.especialidadesFiltradas.slice(startIndex, endIndex);
  }

  buscarEspecialidade() {
    if (this.termoBusca.trim() === '') {
      this.resetarBusca();
    } else {
      const termoNormalizado = AppUtils.normalizarTexto(this.termoBusca);
      // Filtra a lista completa com base no termo de busca
      this.especialidadesFiltradas = this.especialidades.filter(especialidade =>
        AppUtils.normalizarTexto(especialidade.nome).includes(termoNormalizado)
      );

      // Atualiza o total de itens e reseta para a primeira página
      this.totalItems = this.especialidadesFiltradas.length;
      this.currentPage = 1;
      this.atualizarPagina(this.currentPage, this.itemsPerPage);
    }
  }

  resetarBusca() {
    // Se a busca for apagada, volta para a lista completa
    this.especialidadesFiltradas = [...this.especialidades];
    this.totalItems = this.especialidadesFiltradas.length;
    this.currentPage = 1;
    this.atualizarPagina(this.currentPage, this.itemsPerPage);
  }

  onRedirect_Especialistas(term: string) {
    this.router.navigate(['/especialidades/'+term+'/especialistas'])
  }

}
