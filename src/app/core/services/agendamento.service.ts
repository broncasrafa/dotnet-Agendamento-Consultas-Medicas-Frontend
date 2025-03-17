import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { CreateAgendamentoRequest } from 'src/app/core/models/agendamento/request/CreateAgendamentoRequest';
import { AgendamentoResponse } from 'src/app/core/models/agendamento/response/AgendamentoResponse';

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

  /**
   * Obter os dados do agendamento pelo ID especificado
   * @param id identificador do agendamento
   * @returns os dados do agendamento
   */
  getAgendamentoById(id: Number): Observable<AgendamentoResponse> {
    return this.http.get<ApiResponse<AgendamentoResponse>>(`${this.base_api_url}/${id}`, { responseType: 'json'})
            .pipe(map(response => response.data!));
  }
}
