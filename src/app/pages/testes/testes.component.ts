import { Component } from '@angular/core';
import { DropdownBuscaAgendamentoComponent } from '../agendamento/dropdown-busca-agendamento/dropdown-busca-agendamento.component';

@Component({
  selector: 'app-testes',
  standalone: true,
  imports: [
    DropdownBuscaAgendamentoComponent
  ],
  templateUrl: './testes.component.html',
  styleUrl: './testes.component.css'
})
export class TestesComponent {

}
