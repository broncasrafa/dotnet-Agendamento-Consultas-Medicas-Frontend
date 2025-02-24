import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { ApiPagedResponse } from 'src/app/core/models/ApiPagedResponse';
import { PerguntaResponse } from 'src/app/core/models/perguntas-respostas/response/PerguntaResponse';
import { CreatePerguntaRequest } from 'src/app/core/models/perguntas-respostas/request/CreatePerguntaRequest';

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

  /**
   * Recebe uma pergunta específica cadastrada na API
   * @param id id da pergunta a ser buscada
   * @returns Observable<ApiResponse<PerguntaResponse>> com a pergunta buscada
   */
  getPerguntaById(id: number): Observable<ApiResponse<PerguntaResponse>> {
    return this.http.get<ApiResponse<PerguntaResponse>>(`${this.base_api_url_perguntas}/${id}`);
  }

  /**
   * Registrar uma nova pergunta na API
   * @param request dados da pergunta a ser cadastrada
   * @returns true se a pergunta foi cadastrada com sucesso, false caso contrário.
   */
  createPergunta(request: CreatePerguntaRequest): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${this.base_api_url_perguntas}`, request);
  }
}
