import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { PacienteResultListResponse } from 'src/app/core/models/paciente/response/PacienteResultListResponse';
import { AgendamentoResponse } from 'src/app/core/models/agendamento/response/AgendamentoResponse';
import { PacienteResponse } from 'src/app/core/models/paciente/response/PacienteResponse';
import { PacientePlanoMedicoResponse } from 'src/app/core/models/paciente/response/PacientePlanoMedicoResponse';
import { CreatePacientePlanoMedicoRequest } from 'src/app/core/models/paciente/request/CreatePacientePlanoMedicoRequest';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private readonly http = inject(HttpClient);

  private base_api_url = environment.api_url + '/pacientes';

  getPacienteById(id: Number): Observable<PacienteResponse | undefined> {
    return this.http.get<ApiResponse<PacienteResponse>>(`${this.base_api_url}/${id}`, { responseType: 'json' })
      .pipe(map(response => response.data));
  }

  getHistoricoAgendamentosPaciente(id: Number): Observable<AgendamentoResponse[]> {
    return this.http.get<ApiResponse<PacienteResultListResponse<AgendamentoResponse>>>(`${this.base_api_url}/${id}/agendamentos`, { responseType: 'json' })
      .pipe(
        map(response => response.data!.results)
      );
  }

  createPacientePlanoMedico(pacienteid: number, request: CreatePacientePlanoMedicoRequest): Observable<PacientePlanoMedicoResponse> {
    return this.http.post<ApiResponse<PacientePlanoMedicoResponse>>(`${this.base_api_url}/${pacienteid}/planos-medicos`, request)
      .pipe(map(response => response.data!));
  }
}
