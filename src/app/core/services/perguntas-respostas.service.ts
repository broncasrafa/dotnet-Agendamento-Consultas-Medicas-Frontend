import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
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
  private base_api_url_especialista = environment.api_url + '/especialistas';

  constructor(private http: HttpClient) { }

  /**
   * Recebe todas as perguntas das especialidades cadastradas na API de forma paginada
   * @returns Observable<ApiResponse<PerguntaResponse[]>> com as perguntas cadastradas.
   */
  getPerguntasEspecialidadesPaged(page: number, pageSize: number): Observable<ApiPagedResponse<PerguntaResponse>> {
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
   * Registrar uma nova pergunta para a especialidade na API
   * @param request dados da pergunta a ser cadastrada
   * @returns true se a pergunta foi cadastrada com sucesso, false caso contrário.
   */
  createPerguntaEspecialidade(request: CreatePerguntaRequest): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${this.base_api_url_perguntas}`, request);
  }

  /**
   * Registrar uma nova pergunta DIRETAMENTE para o especialista na API
   * @param request dados da pergunta a ser cadastrada
   * @returns true se a pergunta foi cadastrada com sucesso, false caso contrário.
   */
  createPerguntaEspecialista(request: CreatePerguntaRequest): Observable<boolean> {
    return this.http.post<ApiResponse<boolean>>(`${this.base_api_url_especialista}/${request.especialistaId}/perguntas`, request)
      .pipe(map(response => response.data!));
  }

  /**
   * Recebe todas as perguntas das especialidades cadastradas na API de forma paginada
   * @returns Observable<ApiResponse<PerguntaResponse[]>> com as perguntas cadastradas.
   */
  getPerguntasEspecialistasPaged(especialistaId: number, page: number, pageSize: number = 10): Observable<ApiPagedResponse<PerguntaResponse>> {
    return this.http.get<ApiPagedResponse<PerguntaResponse>>(`${this.base_api_url_especialista}/${especialistaId}/perguntas/?page=${page}&items=${pageSize}`, { responseType: 'json' });
  }
}
