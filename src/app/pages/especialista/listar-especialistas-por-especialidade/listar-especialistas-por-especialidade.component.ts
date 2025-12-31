import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AppUtils } from 'src/app/core/utils/app.util';
import { EspecialistaResponse } from 'src/app/core/models/especialista/response/EspecialistaResponse';
import { NumberThousandsFormattedPipe } from 'src/app/shared/pipes/number-thousands-formatted.pipe';
import { DadosEspecialistaListaComponent } from 'src/app/pages/especialista/dados-especialista-lista/dados-especialista-lista.component';
import { ResultResponseEmptyComponent } from 'src/app/shared/components/result-response-empty/result-response-empty.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { EspecialidadeService } from 'src/app/core/services/especialidade.service';

@Component({
  selector: 'app-listar-especialistas-por-especialidade',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NumberThousandsFormattedPipe,
    DadosEspecialistaListaComponent,
    ResultResponseEmptyComponent
  ],
  templateUrl: './listar-especialistas-por-especialidade.component.html',
  styleUrl: './listar-especialistas-por-especialidade.component.css'
})
export class ListarEspecialistasPorEspecialidadeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private authService = inject(AuthenticationService);
  private activatedRoute = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);
  private especialidadeService = inject(EspecialidadeService);

  mostrarModalFazerLogin: boolean = false;
  isLogged: boolean = this.authService.isLoggedIn();
  userInfo = this.authService.getUserInfo();
  term: string;
  totalItems = 0;
  especialidade: string | null = null;
  especialistasList: EspecialistaResponse[] = [];
  especialistasPaginadas: EspecialistaResponse[] = [];

  constructor() {
    const paramTerm = this.activatedRoute.snapshot.paramMap.get('especialidadeterm')!;
    this.term = paramTerm;
    this.getEspecialistasByEspecialidadeTerm();
    this.getEspecialidadesList();
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
  isArrayNullOrEmpty(value: any[]): boolean {
    return AppUtils.isArrayNullOrEmpty<any>(value);
  }

  atualizarPagina(event: any) {
    this.getEspecialistasByEspecialidadeTerm(event.currentPage, event.itemsPerPage);
  }

  getEspecialistasByEspecialidadeTerm(page: number = 1, pageSize: number = 15) {
    this.especialidadeService.getEspecialistasByEspecialidadeTermPaged(this.term, page, pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.especialistasList = response.data!.results;
          this.totalItems = response.data!.total;
        },
        error: (err) => {
          this.notificationService.showHttpResponseErrorNotification(err);
        }
      });
  }

  getEspecialidadesList() {
    this.especialidadeService.getEspecialidades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.especialidade = response.find(c => c.term == this.term)!.nome,
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      })
  }

}
