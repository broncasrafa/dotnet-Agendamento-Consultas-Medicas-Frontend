import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppUtils } from 'src/app/core/utils/app.util';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { ApiPagedResponse } from 'src/app/core/models/ApiPagedResponse';
import { ApiPagedData } from 'src/app/core/models/ApiPagedResponse';
import { CacheService } from 'src/app/shared/services/cache.service';
import { EspecialistaResponse } from 'src/app/core/models/especialista/response/EspecialistaResponse';
import { SintomasDoencasResponse } from 'src/app/core/models/sintomas-e-doencas/response/SintomasDoencasResponse';
import { DISABLE_GLOBAL_LOADING } from 'src/app/core/interceptors/loading-context';

@Injectable({
  providedIn: 'root'
})
export class SintomasEDoencasService {

  private readonly base_api_url = environment.api_url + '/sintomas-e-doencas';

  private http = inject(HttpClient);
  private cacheService = inject(CacheService);


  /**
   * Obter a lista de sintomas e doenças do cache
   * @returns Observable com os dados de sintomas e doenças do cache
   */
  getSintomasDoencasCache(): Observable<SintomasDoencasResponse[]> {
    const cache = this.cacheService.getItem<SintomasDoencasResponse[]>(this.cacheService.keys.sintomasDoencas);

    // Se o cache estiver preenchido, retorna o Observable com os dados do cache
    if (cache) {
      return of(cache);
    }

    // Se não estiver no cache, faz a requisição à API
    return this.http.get<ApiResponse<SintomasDoencasResponse[]>>(this.base_api_url, { responseType: 'json' }).pipe(
      map(response => response.data ?? []),  // Extraímos os dados da resposta
      tap((resultList) => {
        // Armazenamos o resultado no cache
        if (resultList.length) {
          this.cacheService.setItem(this.cacheService.keys.sintomasDoencas, resultList);
        }
      })
    );
  }

  /**
   * Obter a lista de sintomas e doenças de forma paginada
   * @param page - página atual
   * @param itemsPerPage - número de itens por página
   * @returns Observable com os dados paginados de sintomas e doenças
   */
  getSintomasDoencasPaged(page: number = 1, itemsPerPage: number = 15): Observable<ApiPagedData<SintomasDoencasResponse>> {
    return this.http.get<ApiPagedData<SintomasDoencasResponse>>(`${this.base_api_url}/paged/?page=${page}&items=${itemsPerPage}`, { responseType: 'json' })
                    .pipe(map(response => response ?? null));
  }

  /**
   * Obter os dados de sintomas e doenças pelo Id especificado
   * @param id - id do sintoma doença especificado
   * @returns Observable com os dados de sintomas e doenças
   */
  getSintomasDoencasById(id: Number): Observable<SintomasDoencasResponse | undefined> {
    return this.http.get<ApiResponse<SintomasDoencasResponse>>(`${this.base_api_url}/${id}`, { responseType: 'json' })
                    .pipe(map(response => response.data));
  }

  /**
   * Obter a lista paginada de sintomas e doenças pelo Nome especificado
   * @param name - nome do sintomas e doenças de busca
   * @param page - página atual
   * @param itemsPerPage - número de itens por página
   * @returns Observable com os dados paginados de sintomas e doenças
   */
  getSintomasDoencasByNamePaged(name: string, page: number = 1, itemsPerPage: number = 15): Observable<ApiPagedResponse<SintomasDoencasResponse>> {
    return this.http.get<ApiPagedResponse<SintomasDoencasResponse>>(`${this.base_api_url}/search?page=${page}&items=${itemsPerPage}&name=${name}`, { responseType: 'json' });
  }

  /**
   * Obter a lista paginada de Especialistas que tratam os Sintomas e doenças pelos filtros especificados
   * @param name - nome do sintomas e doenças de busca
   * @param page - página atual
   * @param itemsPerPage - número de itens por página
   * @returns Observable com os dados paginados de sintomas e doenças
   */
  getSintomasDoencasEspecialistasByFilterPaged(sintomasDoencasId: number, especialidadeId?: number, page: number = 1, itemsPerPage: number = 15, disableLoading: boolean = false): Observable<ApiPagedResponse<EspecialistaResponse >> {
    let url = `${this.base_api_url}/filter?page=${page}&items=${itemsPerPage}`;

    if (!AppUtils.isNullOrUndefined<Number>(sintomasDoencasId))
      url += `&sintomasDoencasId=${sintomasDoencasId}`;
    if (!AppUtils.isNullOrUndefined<Number>(especialidadeId))
      url += `&especialidadeId=${especialidadeId}`;

    const options: any = {
      responseType: 'json'
    };

    // Se NÃO quiser loading → seta contexto
    const context = disableLoading
      ? new HttpContext().set(DISABLE_GLOBAL_LOADING, true)
      : undefined;

    return this.http.get<ApiPagedResponse<EspecialistaResponse>>(url, {
      // não precisa mexer em responseType, padrão já é 'json'
      ...(context ? { context } : {})
    });
  }



}
