import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PerguntaResponse } from 'src/app/core/models/perguntas-respostas/response/PerguntaResponse';
import { ApiPagedResponse } from 'src/app/core/models/ApiPagedResponse';

@Injectable({
  providedIn: 'root'
})
export class PerguntasRespostasService {

  private base_api_url_perguntas = environment.api_url + '/perguntas';
  private base_api_url_respostas = environment.api_url + '/respostas';

  constructor(private http: HttpClient) { }

  /**
   * Recebe todas as perguntas cadastradas na API de forma paginada
   * @returns Observable<ApiResponse<PerguntaResponse[]>> com as perguntas cadastradas.
   */
  getPerguntasPaged(page: number, pageSize: number): Observable<ApiPagedResponse<PerguntaResponse>> {
    return this.http.get<ApiPagedResponse<PerguntaResponse>>(`${this.base_api_url_perguntas}/?page=${page}&items=${pageSize}`, { responseType: 'json' });
  }
}
