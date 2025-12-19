import { Component } from '@angular/core';
import { AgendamentoBuscaComponent } from 'src/app/pages/consulta/agendamento-busca/agendamento-busca.component';
import { FilterSearchComponent } from 'src/app/shared/components/filter-search/filter-search.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AgendamentoBuscaComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
