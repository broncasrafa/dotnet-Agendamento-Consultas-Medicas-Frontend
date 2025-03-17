import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { EspecialidadeResponse } from 'src/app/core/models/especialidade/response/EspecialidadeResponse';
import { CidadeResponse } from 'src/app/core/models/common/request/CidadeResponse';
import { EspecialidadeService } from 'src/app/core/services/especialidade.service';
import { CommonService } from 'src/app/core/services/common.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AutocompleteSearchComponent } from 'src/app/shared/components/autocomplete-search/autocomplete-search.component';
import { AppUtils } from 'src/app/core/utils/app.util';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-agendamento-busca',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AutocompleteSearchComponent
  ],
  templateUrl: './agendamento-busca.component.html',
  styleUrl: './agendamento-busca.component.css'
})
export class AgendamentoBuscaComponent  implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  searchSubject = new Subject<string>(); // Subject para capturar input do usuário
  private subscriptions: Subscription[] = []; // Correção do tipo Subscription[]

  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private especialidadeService = inject(EspecialidadeService);
  private commonService = inject(CommonService);
  private loadingService = inject(LoadingService);

  placeholderEspecialidadeText = 'Filtre por especialidade';
  placeholderCidadeText = 'Filtre por cidade';
  especialidades: EspecialidadeResponse[] = [];
  cidades: CidadeResponse[] = [];

  especialidadeSelecionada: any = null;
  cidadeSelecionada: any = null;

  constructor() {
    // const searchSubscription = this.searchSubject.pipe(
    //   debounceTime(300),
    //   distinctUntilChanged(),
    //   switchMap(term => term.length >= 3 ? this.commonService.getCidadesByFilterName(term) : [])
    // ).subscribe(results => {
    //   this.cidades = results;
    // });

    // this.subscriptions.push(searchSubscription);

    this.getEspecialidadesList();
    this.getCidadesList();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  getEspecialidadesList() {
    this.especialidadeService.getEspecialidades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.especialidades = response,
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      });
  }
  getCidadesList() {
    this.commonService.getCidades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.cidades = response,
        error: err => this.notificationService.showHttpResponseErrorNotification(err)
      });
  }

  formatEspecialidade(item: any) {
    return item.nome;
  }
  formatCidade(cidade: CidadeResponse): string {
    return cidade.descricaoFormatada;
  }


  onEspecialidadeSelecionada(especialidade: EspecialidadeResponse) {
    this.especialidadeSelecionada = especialidade;
  }
  onCidadeSelecionada(cidade: CidadeResponse) {
    this.cidadeSelecionada = cidade;
  }

  // Captura quando o usuário apaga o campo manualmente
  onEspecialidadeInput(event: any) {
    if (!event.target.value) {
      this.especialidadeSelecionada = null;
    }
  }

  onCidadeInput(event: any) {
    if (!event.target.value) {
      this.cidadeSelecionada = null;
    }
  }

  onPesquisar() {
    this.router.navigate(['/especialistas/pesquisa'], {
      queryParams: {
        cidade: this.cidadeSelecionada.descricao,
        especialidadeId: this.especialidadeSelecionada.id
      }
    });
  }

  habilitarBotaoPesquisar() {
    return (!AppUtils.isNullOrUndefined(this.especialidadeSelecionada) && !AppUtils.isNullOrUndefined(this.cidadeSelecionada))
  }
}

