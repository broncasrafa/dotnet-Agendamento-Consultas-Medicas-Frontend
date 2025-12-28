import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { AppUtils } from 'src/app/core/utils/app.util';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { RatingStarsComponent } from 'src/app/shared/components/rating-stars/rating-stars.component';
import { AddressFormattedPipe } from 'src/app/shared/pipes/address-formatted.pipe';
import { NumberThousandsFormattedPipe } from 'src/app/shared/pipes/number-thousands-formatted.pipe';
import { EspecialidadeResponse } from 'src/app/core/models/especialidade/response/EspecialidadeResponse';
import { EspecialistaResponse } from 'src/app/core/models/especialista/response/EspecialistaResponse';
import { CryptoService } from 'src/app/shared/services/crypto.service';

@Component({
  selector: 'app-dados-especialista-lista',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationComponent,
    NumberThousandsFormattedPipe,
    RatingStarsComponent,
    AddressFormattedPipe
  ],
  templateUrl: './dados-especialista-lista.component.html',
  styleUrl: './dados-especialista-lista.component.css'
})
export class DadosEspecialistaListaComponent implements OnInit, OnDestroy, OnChanges {
  @Input() especialistasList: EspecialistaResponse[] = [];
  @Input() totalItems = 0;
  @Input() currentPage = 1;
  @Input() itemsPerPage = 15;
  @Output() itemsPerPageUpdated = new EventEmitter<any>();

  private destroy$ = new Subject<void>();
  private router = inject(Router);
  private cryptoService = inject(CryptoService);


  // itemsPerPage = 15;
  showDemaisLocaisAtendimento: { [key: number]: boolean } = {};
  showDemaisEspecialidades: { [key: number]: boolean } = {};
  especialistasPaginadas: EspecialistaResponse[] = [];

  constructor() {
  }


  ngOnInit(): void {
    this.currentPage = 1;
    this.atualizarPagina(this.currentPage, this.itemsPerPage);
  }
  ngOnChanges(changes: SimpleChanges): void {
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

  // take(collection: any[], count: number) {
  //   return AppUtils.take(collection, count);
  // }
  skip(collection: any[], count: number) {
    return AppUtils.skip(collection, count);
  }

  mostrarMaisLocaisAtendimento(especialistaId: number) {
    this.showDemaisLocaisAtendimento[especialistaId] = !this.showDemaisLocaisAtendimento[especialistaId];
  }

  // Alterna o estado de showDemaisEspecialidades para o item com o id correspondente
  mostrarMaisEspecialidades(id: number) {
    this.showDemaisEspecialidades[id] = !this.showDemaisEspecialidades[id];
  }
  obterDemaisEspecialidadesString(especialidades: EspecialidadeResponse[]) {
    const demais = especialidades.slice(1)
    return demais.map((c) => c.nome).join(', ');
  }
  obterEspecialidadesParametroString(especialidades: EspecialidadeResponse[]) {
    return especialidades[0]?.nome
  }

  onClick_redirect_especialista_info(especialistaId: number) {
    this.router.navigate(['/especialista/'+ this.cryptoService.criptografar(especialistaId)]);
  }

  atualizarPagina(page: number, pageSize: number) {
    this.currentPage = Number(page);
    this.itemsPerPage = Number(pageSize);
    const startIndex = (page - 1) * pageSize;

    // emit o evento de atualização de items por página para o componente pai
    this.itemsPerPageUpdated.emit({ currentPage: this.currentPage, itemsPerPage: this.itemsPerPage });
  }
}
