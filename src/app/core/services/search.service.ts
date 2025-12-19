import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { SelectEspecialidadesAndEspecialistasByNameResponse } from 'src/app/core/models/search/response/SelectEspecialidadesAndEspecialistasByNameResponse';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private readonly http = inject(HttpClient);

  private base_api_url = environment.api_url + '/search';

  constructor() { }

  /**
   * Obter a lista de Especialidades ou Especialistas pelo termo de busca especificado.
   * @param termoBusca Termo de busca.
   * @param especialidades Lista de especialidades.
   * @returns Lista de especialidades filtrada.
   */
  searchAllEspecialidadesAndEspecialistasByTerm(termoBusca: string): Observable<ApiResponse<SelectEspecialidadesAndEspecialistasByNameResponse>> {
    const sanitizedTerm = encodeURIComponent(termoBusca.trim());
    return this.http.get<ApiResponse<SelectEspecialidadesAndEspecialistasByNameResponse>>(`${this.base_api_url}/especialidades-and-especialistas?term=${sanitizedTerm}`);
  }
}
