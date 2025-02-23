import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { EspecialidadeResponse } from 'src/app/core/models/especialidade/response/EspecialidadeResponse';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadeService {
  private base_api_url = environment.api_url + '/especialidades';

  constructor(private http: HttpClient) { }

  getEspecialidades(): Observable<EspecialidadeResponse[]> {
    return this.http.get<ApiResponse<EspecialidadeResponse[]>>(`${this.base_api_url}`, { responseType: 'json' })
              .pipe(
                map(response => response.data ?? [])
              );
  }
}
