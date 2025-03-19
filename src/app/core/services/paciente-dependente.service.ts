import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { PacienteDependenteResponse } from 'src/app/core/models/paciente/response/PacienteDependenteResponse';
import { PacientePlanoMedicoResponse } from 'src/app/core/models/paciente/response/PacientePlanoMedicoResponse';
import { CreatePacienteDependenteRequest } from 'src/app/core/models/paciente/request/CreatePacienteDependenteRequest';
import { DeletePacienteDependenteRequest } from 'src/app/core/models/paciente/request/DeletePacienteDependenteRequest';
import { UpdatePacienteDependenteRequest } from 'src/app/core/models/paciente/request/UpdatePacienteDependenteRequest';
import { DeletePacienteDependentePlanoMedicoRequest } from 'src/app/core/models/paciente/request/DeletePacienteDependentePlanoMedicoRequest';
import { UpdatePacienteDependentePlanoMedicoRequest } from 'src/app/core/models/paciente/request/UpdatePacienteDependentePlanoMedicoRequest';
import { CreatePacienteDependentePlanoMedicoRequest } from 'src/app/core/models/paciente/request/CreatePacienteDependentePlanoMedicoRequest';

@Injectable({
  providedIn: 'root'
})
export class PacienteDependenteService {

  private readonly http = inject(HttpClient);

  private base_api_url = environment.api_url + '/dependentes';


  getPacienteDependenteById(dependenteId: number): Observable<PacienteDependenteResponse> {
    return this.http.get<ApiResponse<PacienteDependenteResponse>>(`${this.base_api_url}/${dependenteId}`, { responseType: 'json' })
      .pipe(map(response => response.data!));
  }

  createPacienteDependente(request: CreatePacienteDependenteRequest): Observable<PacienteDependenteResponse> {
    return this.http.post<ApiResponse<PacienteDependenteResponse>>(`${this.base_api_url}/`, request)
      .pipe(map(response => response.data!));
  }

  updatePacienteDependente(request: UpdatePacienteDependenteRequest): Observable<boolean> {
    return this.http.put<ApiResponse<boolean>>(`${this.base_api_url}/`, request)
      .pipe(map(response => response.data!));
  }

  deletePacienteDependente(request: DeletePacienteDependenteRequest): Observable<boolean> {
    const options = {
      body: request
    };
    return this.http.delete<ApiResponse<boolean>>(`${this.base_api_url}/`, options)
      .pipe(map(response => response.data!));
  }


  createPacienteDependentePlanoMedico(dependenteId: number, request: CreatePacienteDependentePlanoMedicoRequest): Observable<PacientePlanoMedicoResponse> {
    return this.http.post<ApiResponse<PacientePlanoMedicoResponse>>(`${this.base_api_url}/${dependenteId}/planos-medicos`, request)
      .pipe(map(response => response.data!));
  }

  updatePacienteDependentePlanoMedico(dependenteId: number, request: UpdatePacienteDependentePlanoMedicoRequest): Observable<boolean> {
    return this.http.put<ApiResponse<boolean>>(`${this.base_api_url}/${dependenteId}/planos-medicos`, request)
      .pipe(map(response => response.data!));
  }

  deletePacienteDependentePlanoMedico(dependenteId: number, request: DeletePacienteDependentePlanoMedicoRequest): Observable<boolean> {
    const options = {
      body: request
    };
    return this.http.delete<ApiResponse<boolean>>(`${this.base_api_url}/${dependenteId}/planos-medicos`, options)
      .pipe(map(response => response.data!));
  }
}
