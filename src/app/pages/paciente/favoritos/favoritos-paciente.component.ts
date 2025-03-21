import { Component, ElementRef, inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { RatingStarsComponent } from 'src/app/shared/components/rating-stars/rating-stars.component';
import { EspecialistaResponse } from 'src/app/core/models/especialista/response/EspecialistaResponse';
import { AppUtils } from 'src/app/core/utils/app.util';
import { EspecialistaService } from 'src/app/core/services/especialista.service';
import { EspecialidadeService } from 'src/app/core/services/especialidade.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CryptoService } from 'src/app/shared/services/crypto.service';
import { HorariosAgendamento, ListarHorariosDisponiveisComponent } from 'src/app/pages/especialista/listar-horarios-disponiveis/listar-horarios-disponiveis.component';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { FavoritagemEspecialistaRequest } from 'src/app/core/models/paciente/request/FavoritagemEspecialistaRequest';

@Component({
  selector: 'app-favoritos-paciente',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RatingStarsComponent,
    PaginationComponent
  ],
  templateUrl: './favoritos-paciente.component.html',
  styleUrl: './favoritos-paciente.component.css'
})
export class FavoritosPacienteComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private cryptoService = inject(CryptoService);
  private loadingService = inject(LoadingService);
  private authService = inject(AuthenticationService);
  private pacienteService = inject(PacienteService);

  especialistas: EspecialistaResponse[] = [];
  pacienteId: number;
  endPage: number = 1;
  nextPage: number = 1;
  hasNextPage: boolean = false;
  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;

  constructor() {
    const userLoggedInfo = this.authService.getUserInfo();
    this.pacienteId = userLoggedInfo.id!;

    this.obterListaEspecialistasFavoritosPaciente();

  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDataIsReady() {
    return !this.isNullOrUndefined(this.especialistas);
  }
  isNullOrEmpty(value: any): boolean {
    return AppUtils.isNullOrEmpty(value);
  }
  isNullOrUndefined(value: any): boolean {
    return AppUtils.isNullOrUndefined(value);
  }

  obterListaEspecialistasFavoritosPaciente() {
    this.pacienteService.getEspecialistasFavoritosPacienteById(this.pacienteId, this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          if (!AppUtils.isNullOrUndefined(response) && response.data.results.length > 0) {
            this.especialistas = response.data.results;
            this.endPage = response.data.endPage;
            this.nextPage = response.data.nextPage;
            this.hasNextPage = response.data.hasNextPage;
            this.totalItems = response.data.total;
          }
        },
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      })
  }

  onPageChanged(event: { page: number; pageSize: number }) {

    this.currentPage = event.page;
    this.pageSize = event.pageSize;

    this.obterListaEspecialistasFavoritosPaciente();
  }

  onclick_DesfavoritarEspecialista(especialistaId: number) {
    const request = {
      pacienteId: this.pacienteId,
      especialistaId: especialistaId
    } as FavoritagemEspecialistaRequest;

    this.pacienteService.desfavortitarEspecialista(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          AppUtils.removerItemNaListaById(this.especialistas, especialistaId);
          this.totalItems--;

          // Se a página atual ficou sem itens, voltar para a anterior
          const totalPaginas = Math.ceil(this.totalItems / this.pageSize);
          if (this.currentPage > totalPaginas) {
            this.currentPage = totalPaginas || 1; // Se não houver mais páginas, volta para 1
          }

          this.obterListaEspecialistasFavoritosPaciente(); // Atualiza a lista

          this.notificationService.showSuccessNotification('Removido', 'Perfil removido dos seus favoritos')
        },
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      });
  }

  onRedirect_EspecialistaDetalhes(especialistaId: number) {
    this.router.navigate(['/especialista/'+ this.cryptoService.criptografar(especialistaId)]);
  }
}
