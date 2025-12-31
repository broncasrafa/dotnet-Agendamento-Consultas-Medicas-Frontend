import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CacheService } from 'src/app/shared/services/cache.service';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { ConvenioMedicoResponse } from 'src/app/core/models/convenio-medico/response/ConvenioMedicoResponse';
import { EspecialidadeResponse } from 'src/app/core/models/especialidade/response/EspecialidadeResponse';
import { ApiPagedResponse } from 'src/app/core/models/ApiPagedResponse';

@Injectable({
  providedIn: 'root'
})
export class ConvenioMedicoService {

  private readonly base_api_url = environment.api_url + '/convenios-medicos';

    constructor(private http: HttpClient, private cacheService: CacheService) { }

    /**
     * Obtém a lista de ConveniosMedicos, utilizando o cache sempre que possível.
     */
    getConveniosMedicos(): Observable<ConvenioMedicoResponse[]> {
      const cache = this.cacheService.getItem<ConvenioMedicoResponse[]>(this.cacheService.keys.conveniosMedicos);

      // Se o cache estiver preenchido, retorna o Observable com os dados do cache
      if (cache) {
        return of(cache);
      }

      // Se não estiver no cache, faz a requisição à API
      return this.http.get<ApiResponse<ConvenioMedicoResponse[]>>(this.base_api_url, { responseType: 'json' }).pipe(
        map(response => response.data ?? []),  // Extraímos os dados da resposta
        tap((conveniosMedicos) => {
          // Armazenamos o resultado no cache
          if (conveniosMedicos.length) {
            this.cacheService.setItem(this.cacheService.keys.conveniosMedicos, conveniosMedicos);
          }
        })
      );
    }

    /**
     * Obter as cidades atendidas pelo Convenio Medico pelo ID especificado
     * @param convenioMedicoId identificador do convenio medico
     * @returns a lista cidades atendidas pelo Convenio Medico
     */
    getCidadesAtendidasConveniosMedicos(convenioMedicoId: Number): Observable<ConvenioMedicoResponse> {
      return this.http.get<ApiResponse<ConvenioMedicoResponse>>(`${this.base_api_url}/${convenioMedicoId}/cidades`, { responseType: 'json' })
                  .pipe(map(response => response.data!));
    }

    /**
       * Obter a lista paginada das especialidades atendidas pelo Convenio Medico especificado na cidade especificada
       * @param convenioMedicoId - identificador do convenio medico
       * @param cidadeId - identificador da cidade
       * @param page - página atual
       * @param itemsPerPage - número de itens por página
       * @returns Observable com os dados paginados das especialidades atendidas pelo Convenio Medico especificado na cidade especificada
       */
      getEspecialidadesByConvenioAndCidadePaged(convenioMedicoId: number, cidadeId: number, page: number = 1, itemsPerPage: number = 15): Observable<ApiPagedResponse<EspecialidadeResponse>> {
        return this.http.get<ApiPagedResponse<EspecialidadeResponse>>(`${this.base_api_url}/${convenioMedicoId}/cidades/${cidadeId}/especialidades?page=${page}&items=${itemsPerPage}`, { responseType: 'json' });
      }
}
