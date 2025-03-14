import { Component, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  @Input() especialistaId: Number;
  @Output() horarioSelecionadoEvent = new EventEmitter<{ data: string, horario: string, especialistaId: Number }>();

  dias: HorariosAgendamento[] = [];
  diaSelecionado: string | null = null;
  horarioSelecionado: string | null = null;
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

    // resolver a parte de estar no mesmo dia que hoje porém o horario do atendimento do dia ja deu
    const hoje = new Date();
    const ehHoje = hoje.toISOString().split('T')[0] === data;
    const horaAtual = hoje.getHours();
    const minutoAtual = hoje.getMinutes();

    for (let h = 8; h < 19; h++) {
      for (let m of [0, 30]) {
        const horarioDoDiaExcedido = (ehHoje && (h < horaAtual || (h === horaAtual && m < minutoAtual)));
        let horario = "-";

        if (horariosJaAgendados.length > 0 && !horarioDoDiaExcedido) {
          horario = `${h.toString().padStart(2, '0')}:${m === 0 ? '00' : '30'}`;
        }

        horarios.push(horario);
      }
    }
    // Se não houver horários disponíveis, preenche com tracinhos
    return horarios.length > 0 ? horarios : Array(22).fill("-");
  }

  estaAgendado(data: string, horario: string): boolean {
    const diaAgendado = this.listaHorariosJaAgendados.find(d => d.data === data);
    return diaAgendado?.horarios.includes(horario) ?? false;
  }

  selecionarDia(dia: string, horario: string): void {
    if (horario === '-' || this.estaAgendado(dia, horario)) {
      return; // Não permite selecionar horários já agendados ou não disponíveis
    }

    this.diaSelecionado = dia;
    this.horarioSelecionado = horario;

    // Emite o evento para o componente pai
    this.horarioSelecionadoEvent.emit({
      data: this.diaSelecionado,
      horario: this.horarioSelecionado,
      especialistaId: this.especialistaId
    });
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

  formatarDiaComLabel(data: string): string {
    const dataObj = new Date(data + 'T00:00:00'); // Garante que a data seja local
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera horas, minutos, segundos e milissegundos para comparar corretamente
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);

    if (dataObj.getTime() === hoje.getTime()) {
      return `Hoje\n${this.formatarData(data)}`;
    } else if (dataObj.getTime() === amanha.getTime()) {
      return `Amanhã\n${this.formatarData(data)}`;
    } else {
      const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      return `${diasSemana[dataObj.getDay()]}\n${this.formatarData(data)}`;
    }
  }

  trackByData(index: number, item: HorariosAgendamento): string {
    return item.data;
  }
}
