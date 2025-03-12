import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { StringExtensions } from 'src/app/core/extensions/string.extensions';
import { AppUtils } from 'src/app/core/utils/app.util';
import { EspecialistaResponse } from 'src/app/core/models/especialista/response/EspecialistaResponse';
import { EspecialidadeResponse } from 'src/app/core/models/especialidade/response/EspecialidadeResponse';
import { EspecialistaService } from 'src/app/core/services/especialista.service';
import { EspecialidadeService } from 'src/app/core/services/especialidade.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Modal } from 'bootstrap';
import { ConvenioMedicoResponse } from 'src/app/core/models/convenio-medico/response/ConvenioMedicoResponse';
import { RatingStarsComponent } from 'src/app/shared/components/rating-stars/rating-stars.component';
import { HorariosAgendamento, ListarHorariosDisponiveisComponent } from 'src/app/pages/especialista/listar-horarios-disponiveis/listar-horarios-disponiveis.component';
import { IsNullOrUndefinedPipe } from 'src/app/shared/pipes/is-null-or-undefined.pipe';

@Component({
  selector: 'app-pesquisar-especialista',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    RatingStarsComponent,
    ListarHorariosDisponiveisComponent,
    IsNullOrUndefinedPipe
  ],
  templateUrl: './pesquisar-especialista.component.html',
  styleUrl: './pesquisar-especialista.component.css'
})
export class PesquisarEspecialistaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private especialistaService = inject(EspecialistaService);
  private especialidadeService = inject(EspecialidadeService);
  private notificationService = inject(NotificationService);

  cidade: string | null = null;
  especialidadeId: number | null = null;
  especialidade: string | null = null;
  especialistas: EspecialistaResponse[] = [];
  showDemaisEspecialidades: { [key: number]: boolean } = {};
  paginaAtual = 1; // Página inicial
  carregando = false; // Flag para controlar requisição
  temMaisItens = true; // Flag para desativar o botão se não houver mais itens
  modalInstance?: Modal;
  conveniosAtendidos: string[] = [];
  horarios: HorariosAgendamento[] = [
    {
      data: '2025-03-12',
      horarios: ["09:00", "09:30", "10:00", "10:30"]
    },
    {
      data: '2025-03-13',
      horarios: ["08:00", "09:00", "09:30", "10:00", "10:30", "11:00", "12:00"]
    },
    {
      data: '2025-03-14',
      horarios: ["08:30", "09:00", "09:30", "10:00", "10:30"]
    },
    {
      data: '2025-03-15',
      horarios: ["10:00", "10:30", "11:00", "11:30"]
    },
    {
      data: '2025-03-17',
      horarios: ["08:00", "09:00", "09:30", "10:00", "10:30"]
    },
    {
      data: '2025-03-18',
      horarios: ["08:00", "09:00", "09:30", "10:00", "10:30"]
    },
    {
      data: '2025-03-19',
      horarios: ["08:00", "09:00", "09:30", "10:00", "10:30"]
    },
    {
      data: '2025-03-20',
      horarios: ["08:00", "09:00", "09:30", "10:00", "10:30"]
    },
    {
      data: '2025-03-21',
      horarios: ["08:00", "09:00", "09:30", "10:00", "10:30"]
    },
  ];
/*
HorariosAgendamento {
  data: string,
  horarios: string[]
}
*/
  constructor() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.cidade = params['cidade'] || null;
      this.especialidadeId = params['especialidadeId'] ? Number(params['especialidadeId']) : null;

      if (StringExtensions.isNullOrWhiteSpace(this.cidade) || this.especialidadeId == null){
        this.router.navigateByUrl('/404-page')
      }
    });
  }

  ngOnInit(): void {
    this.getEspecialidadesList();
    this.pesquisarEspecialistas();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isNullOrUndefined(value: any): boolean {
    return AppUtils.isNullOrUndefined(value);
  }

  getEspecialidadesList() {
    this.especialidadeService.getEspecialidades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.especialidade = response.find(c => c.id == this.especialidadeId)!.nome,
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      })
  }

  pesquisarEspecialistas() {
    this.especialistaService.getEspecialistasByFilter(Number(this.especialidadeId), this.cidade!, this.paginaAtual)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resp: any) => {
        if (!AppUtils.isNullOrUndefined(resp) && resp.data.results.length > 0) {
          this.especialistas = resp.data.results
          this.paginaAtual++;
          this.temMaisItens = resp.data.hasNextPage;
          console.log('[DATA]:', resp.data);
        } else {
          this.temMaisItens = false;
        }
      },
      error: err => this.notificationService.showHttpResponseErrorNotification(err)
    });
  }

  carregarMaisEspecialistas() {
    if (this.carregando || !this.temMaisItens)
      return;

    this.carregando = true;

    this.especialistaService.getEspecialistasByFilter(Number(this.especialidadeId), this.cidade!, this.paginaAtual)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resp: any) => {
        if (!AppUtils.isNullOrUndefined(resp) && resp.data.results.length > 0) {
          this.especialistas = [...this.especialistas, ...resp.data.results]; // Concatena os novos itens
          this.paginaAtual++;
          this.temMaisItens = resp.data.hasNextPage;
          this.carregando = false;
          console.log('[RESULTS]:', resp.data.results)
          console.log('[LISTA]:', this.especialistas)
        } else {
          this.carregando = false;
          this.temMaisItens = false;
        }
      },
      error: err => this.notificationService.showHttpResponseErrorNotification(err)
    });
  }



  // Alterna o estado de showDemaisEspecialidades para o item com o id correspondente
  mostrarMaisEspecialidades(id: number) {
    this.showDemaisEspecialidades[id] = !this.showDemaisEspecialidades[id];
  }

  obterDemaisEspecialidadesString(especialidades: EspecialidadeResponse[]) {
    const demais = especialidades.filter(especialidade => especialidade.id !== this.especialidadeId);
    return demais.map((c) => c.nome).join(', ');
  }
  obterEspecialidadesParametroString(especialidades: EspecialidadeResponse[]) {
    return especialidades.find(c => c.id == this.especialidadeId)?.nome
  }

  abrirModalConveniosAtendidos(convenios: ConvenioMedicoResponse[]) {
    this.conveniosAtendidos = [];
    this.conveniosAtendidos = convenios.map((c) => c.nome);

    const modalElement = document.getElementById('modalConvenios');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
      this.modalInstance.show();
    }
  }
}
