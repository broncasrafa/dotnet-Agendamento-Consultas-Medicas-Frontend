import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

export interface HorariosAgendamento {
  data: string,
  horarios: string[]
}

@Component({
  selector: 'app-listar-horarios-disponiveis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-horarios-disponiveis.component.html',
  styleUrl: './listar-horarios-disponiveis.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListarHorariosDisponiveisComponent implements OnInit  {

  @Input() listaHorariosJaAgendados: HorariosAgendamento[] = [];
  dias: HorariosAgendamento[] = [];
  diaSelecionado: string | null = null;
  mostrarTodosHorarios: boolean = false;
  gruposDias: HorariosAgendamento[][] = [];
  indiceAtual = 0;
  horariosDisponiveis: string[] = [];
  diasExpandido: { [data: string]: boolean } = {};


  ngOnInit(): void {
    this.gerarDiasDisponiveis();
  }

  gerarDiasDisponiveis() {
    const hoje = new Date();
    const diasGerados: HorariosAgendamento[] = [];

    for (let i = 0; i < 30; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() + i);

      const dataFormatada = data.toISOString().split('T')[0];
      const horariosDisponiveis = this.gerarHorarios(dataFormatada);

      diasGerados.push({ data: dataFormatada, horarios: horariosDisponiveis });
    }

    this.dias = diasGerados;
    this.gruposDias = this.dividirEmGrupos(diasGerados, 5);
  }

  gerarHorarios(data: string): string[] {
    const horarios: string[] = [];
    const horariosJaAgendados = this.listaHorariosJaAgendados.find(d => d.data === data)?.horarios || [];

    for (let h = 8; h < 19; h++) {
      for (let m of [0, 30]) {
        const horario = `${h.toString().padStart(2, '0')}:${m === 0 ? '00' : '30'}`;
        if (!horariosJaAgendados.includes(horario)) {
          horarios.push(horario);
        }
      }
    }
    return horarios;
  }

  toggleExpandir(): void {
    this.mostrarTodosHorarios = !this.mostrarTodosHorarios;
  }

  mudarSlide(direcao: number): void {
    const novoIndice = this.indiceAtual + direcao;
    if (novoIndice >= 0 && novoIndice < this.gruposDias.length) {
      this.indiceAtual = novoIndice;
    }
  }

  dividirEmGrupos<T>(array: T[], tamanhoGrupo: number): T[][] {
    const grupos: T[][] = [];
    for (let i = 0; i < array.length; i += tamanhoGrupo) {
      grupos.push(array.slice(i, i + tamanhoGrupo));
    }
    return grupos;
  }

  formatarData(data: string): string {
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}`;
  }

  trackByData(index: number, item: HorariosAgendamento): string {
    return item.data;
  }
}
