import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { PacienteResponse } from 'src/app/core/models/paciente/response/PacienteResponse';

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
}
