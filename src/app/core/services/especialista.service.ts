import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppUtils } from 'src/app/core/utils/app.util';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { ApiPagedData } from 'src/app/core/models/ApiPagedResponse';
import { EspecialistaResponse } from 'src/app/core/models/especialista/response/EspecialistaResponse';

@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {
  private base_api_url = environment.api_url + '/especialistas';

  constructor(private http: HttpClient) { }


  getEspecialistasPaged(page: number = 1, itemsPerPage: number = 15): Observable<ApiPagedData<EspecialistaResponse>> {
    return this.http.get<ApiPagedData<EspecialistaResponse>>(`${this.base_api_url}/?page=${page}&items=${itemsPerPage}`, { responseType: 'json' })
              .pipe(map(response => response ?? null));
  }

  getEspecialistasByNamePaged(name: string, page: number = 1, itemsPerPage: number = 15): Observable<ApiPagedData<EspecialistaResponse>> {
    const sanitizedTerm = encodeURIComponent(name.trim());
    return this.http.get<ApiPagedData<EspecialistaResponse>>(`${this.base_api_url}/searchByName?name=${sanitizedTerm}&page=${page}&items=${itemsPerPage}`, { responseType: 'json' })
              .pipe(map(response => response ?? null));
  }

  getEspecialistasByFilter(especialidadeId: number, convenioMedicoId: number, cidade: string, page: number = 1): Observable<ApiPagedData<EspecialistaResponse>> {
    let url = `${this.base_api_url}/filter/?page=${page}&items=15`;

    if (!AppUtils.isNullOrUndefined<Number>(especialidadeId) && especialidadeId > 0) {
      url += `&especialidadeId=${especialidadeId}`;
    }
    if (!AppUtils.isNullOrUndefined<Number>(convenioMedicoId) && convenioMedicoId > 0) {
      url += `&convenioMedicoId=${convenioMedicoId}`;
    }
    if (!AppUtils.isNullOrEmpty(cidade)) {
      url += `&cidade=${cidade.trim()}`;
    }
    return this.http.get<ApiPagedData<EspecialistaResponse>>(url, { responseType: 'json' })
              .pipe(
                map(response => response ?? null)
              );
  }

  getEspecialistaById(id: Number): Observable<EspecialistaResponse | undefined> {
    return this.http.get<ApiResponse<EspecialistaResponse>>(`${this.base_api_url}/${id}`, { responseType: 'json' })
      .pipe(map(response => response.data));
  }
}
