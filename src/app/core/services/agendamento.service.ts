import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { CreateAgendamentoRequest } from 'src/app/core/models/agendamento/request/CreateAgendamentoRequest';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private base_api_url = environment.api_url + '/agendamentos';

  constructor(private http: HttpClient) { }

  /**
   * Registra um novo agendamento de consulta na API.
   * @param request Dados do agendamento a ser cadastrado.
   * @returns Observable<ApiResponse<number>> indicando o id do agendamento
   */
  createAgendamento(request: CreateAgendamentoRequest): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(`${this.base_api_url}/`, request);
  }
}
