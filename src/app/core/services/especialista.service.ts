import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { EspecialistaResponse } from 'src/app/core/models/especialista/response/EspecialistaResponse';
import { ApiPagedData } from 'src/app/core/models/ApiPagedResponse';

@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {
  private base_api_url = environment.api_url + '/especialistas';

  constructor(private http: HttpClient) { }

  getEspecialistasByFilter(especialidadeId: number, cidade: string, page: number = 1): Observable<ApiPagedData<EspecialistaResponse>> {
    return this.http.get<ApiPagedData<EspecialistaResponse>>(`${this.base_api_url}/filter/?cidade=${cidade}&especialidadeId=${especialidadeId}&page=${page}&items=10`, { responseType: 'json' })
              .pipe(
                map(response => response ?? null)
              );
  }
}
