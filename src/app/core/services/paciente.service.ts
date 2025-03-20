import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { ApiPagedData } from 'src/app/core/models/ApiPagedResponse';
import { PacienteResultListResponse } from 'src/app/core/models/paciente/response/PacienteResultListResponse';
import { EspecialistaResponse } from 'src/app/core/models/especialista/response/EspecialistaResponse';
import { AgendamentoResponse } from 'src/app/core/models/agendamento/response/AgendamentoResponse';
import { PacienteResponse } from 'src/app/core/models/paciente/response/PacienteResponse';
import { PacientePlanoMedicoResponse } from 'src/app/core/models/paciente/response/PacientePlanoMedicoResponse';
import { PacienteDependenteResponse } from 'src/app/core/models/paciente/response/PacienteDependenteResponse';
import { CreatePacientePlanoMedicoRequest } from 'src/app/core/models/paciente/request/CreatePacientePlanoMedicoRequest';
import { UpdatePacientePlanoMedicoRequest } from 'src/app/core/models/paciente/request/UpdatePacientePlanoMedicoRequest';
import { DeletePacientePlanoMedicoRequest } from 'src/app/core/models/paciente/request/DeletePacientePlanoMedicoRequest';
import { UpdatePacienteRequest } from 'src/app/core/models/paciente/request/UpdatePacienteRequest';
import { FavoritagemEspecialistaRequest } from 'src/app/core/models/paciente/request/FavoritagemEspecialistaRequest';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private readonly http = inject(HttpClient);

  private base_api_url = environment.api_url + '/pacientes';

  getPacienteById(pacienteId: Number): Observable<PacienteResponse | undefined> {
    return this.http.get<ApiResponse<PacienteResponse>>(`${this.base_api_url}/${pacienteId}`, { responseType: 'json' })
      .pipe(map(response => response.data));
  }

  updatePacienteById(pacienteId: number, request: UpdatePacienteRequest): Observable<boolean> {
    return this.http.put<ApiResponse<boolean>>(`${this.base_api_url}/${pacienteId}`, request)
      .pipe(map(response => response.data!));
  }

  getHistoricoAgendamentosPaciente(pacienteId: Number): Observable<AgendamentoResponse[]> {
    return this.http.get<ApiResponse<PacienteResultListResponse<AgendamentoResponse>>>(`${this.base_api_url}/${pacienteId}/agendamentos`, { responseType: 'json' })
      .pipe(
        map(response => response.data!.results)
      );
  }

  getDependentesPaciente(pacienteId: Number): Observable<PacienteDependenteResponse[]> {
    return this.http.get<ApiResponse<PacienteResultListResponse<PacienteDependenteResponse>>>(`${this.base_api_url}/${pacienteId}/dependentes`, { responseType: 'json' })
      .pipe(
        map(response => response.data!.results)
      );
  }

  createPacientePlanoMedico(pacienteId: number, request: CreatePacientePlanoMedicoRequest): Observable<PacientePlanoMedicoResponse> {
    return this.http.post<ApiResponse<PacientePlanoMedicoResponse>>(`${this.base_api_url}/${pacienteId}/planos-medicos`, request)
      .pipe(map(response => response.data!));
  }

  updatePacientePlanoMedico(pacienteId: number, request: UpdatePacientePlanoMedicoRequest): Observable<boolean> {
    return this.http.put<ApiResponse<boolean>>(`${this.base_api_url}/${pacienteId}/planos-medicos`, request)
      .pipe(map(response => response.data!));
  }

  deletePacientePlanoMedico(pacienteId: number, request: DeletePacientePlanoMedicoRequest): Observable<boolean> {
    const options = {
      body: request
    };
    return this.http.delete<ApiResponse<boolean>>(`${this.base_api_url}/${pacienteId}/planos-medicos`, options)
      .pipe(map(response => response.data!));
  }

  getEspecialistasFavoritosPacienteById(pacienteId: number, page: number = 1, pageSize: number = 10): Observable<ApiPagedData<EspecialistaResponse>> {
      return this.http.get<ApiPagedData<EspecialistaResponse>>(`${this.base_api_url}/${pacienteId}/favoritos/?page=${page}&items=${pageSize}`, { responseType: 'json' })
                .pipe( map(response => response ?? null));
  }

  favortitarEspecialista(request: FavoritagemEspecialistaRequest): Observable<boolean> {
    return this.http.post<ApiResponse<boolean>>(`${this.base_api_url}/${request.pacienteId}/favoritos/like`, request)
      .pipe(map(response => response.data!));
  }

  desfavortitarEspecialista(request: FavoritagemEspecialistaRequest): Observable<boolean> {
    const options = {
      body: request
    };
    return this.http.delete<ApiResponse<boolean>>(`${this.base_api_url}/${request.pacienteId}/favoritos/dislike`, options)
      .pipe(map(response => response.data!));
  }
}
