import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { PacienteResultListResponse } from 'src/app/core/models/paciente/response/PacienteResultListResponse';
import { AgendamentoResponse } from 'src/app/core/models/agendamento/response/AgendamentoResponse';
import { PacienteResponse } from 'src/app/core/models/paciente/response/PacienteResponse';
import { PacientePlanoMedicoResponse } from 'src/app/core/models/paciente/response/PacientePlanoMedicoResponse';
import { PacienteDependenteResponse } from 'src/app/core/models/paciente/response/PacienteDependenteResponse';
import { CreatePacientePlanoMedicoRequest } from 'src/app/core/models/paciente/request/CreatePacientePlanoMedicoRequest';
import { UpdatePacientePlanoMedicoRequest } from 'src/app/core/models/paciente/request/UpdatePacientePlanoMedicoRequest';
import { DeletePacientePlanoMedicoRequest } from 'src/app/core/models/paciente/request/DeletePacientePlanoMedicoRequest';
import { UpdatePacienteRequest } from 'src/app/core/models/paciente/request/UpdatePacienteRequest';
import { CreatePacienteDependenteRequest } from '../models/paciente/request/CreatePacienteDependenteRequest';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private readonly http = inject(HttpClient);

  private base_api_url = environment.api_url + '/pacientes';
  private base_api_url_dependentes = environment.api_url + '/dependentes';

  getPacienteById(id: Number): Observable<PacienteResponse | undefined> {
    return this.http.get<ApiResponse<PacienteResponse>>(`${this.base_api_url}/${id}`, { responseType: 'json' })
      .pipe(map(response => response.data));
  }

  updatePacienteById(pacienteid: number, request: UpdatePacienteRequest): Observable<boolean> {
    return this.http.put<ApiResponse<boolean>>(`${this.base_api_url}/${pacienteid}`, request)
      .pipe(map(response => response.data!));
  }



  getHistoricoAgendamentosPaciente(id: Number): Observable<AgendamentoResponse[]> {
    return this.http.get<ApiResponse<PacienteResultListResponse<AgendamentoResponse>>>(`${this.base_api_url}/${id}/agendamentos`, { responseType: 'json' })
      .pipe(
        map(response => response.data!.results)
      );
  }

  getDependentesPaciente(id: Number): Observable<PacienteDependenteResponse[]> {
    return this.http.get<ApiResponse<PacienteResultListResponse<PacienteDependenteResponse>>>(`${this.base_api_url}/${id}/dependentes`, { responseType: 'json' })
      .pipe(
        map(response => response.data!.results)
      );
  }

  createPacientePlanoMedico(pacienteid: number, request: CreatePacientePlanoMedicoRequest): Observable<PacientePlanoMedicoResponse> {
    return this.http.post<ApiResponse<PacientePlanoMedicoResponse>>(`${this.base_api_url}/${pacienteid}/planos-medicos`, request)
      .pipe(map(response => response.data!));
  }

  updatePacientePlanoMedico(pacienteid: number, request: UpdatePacientePlanoMedicoRequest): Observable<boolean> {
    return this.http.put<ApiResponse<boolean>>(`${this.base_api_url}/${pacienteid}/planos-medicos`, request)
      .pipe(map(response => response.data!));
  }

  deletePacientePlanoMedico(pacienteid: number, request: DeletePacientePlanoMedicoRequest): Observable<boolean> {
    const options = {
      body: request
    };
    return this.http.delete<ApiResponse<boolean>>(`${this.base_api_url}/${pacienteid}/planos-medicos`, options)
      .pipe(map(response => response.data!));
  }



  createPacienteDependente(request: CreatePacienteDependenteRequest): Observable<PacienteDependenteResponse> {
    return this.http.post<ApiResponse<PacienteDependenteResponse>>(`${this.base_api_url_dependentes}/`, request)
      .pipe(map(response => response.data!));
  }
}
