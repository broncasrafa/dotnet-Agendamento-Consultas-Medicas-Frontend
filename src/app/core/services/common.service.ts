import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { CidadeResponse } from 'src/app/core/models/common/request/CidadeResponse';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private base_api_url = environment.api_url + '/common';

  constructor(private http: HttpClient) { }

  getCidadesByFilterName(name: string): Observable<CidadeResponse[]> {
    return this.http.get<ApiResponse<CidadeResponse[]>>(`${this.base_api_url}/cidades/search?name=${name}`, { responseType: 'json'})
              .pipe(
                map(response => response.data ?? [])
              );
  }
}
