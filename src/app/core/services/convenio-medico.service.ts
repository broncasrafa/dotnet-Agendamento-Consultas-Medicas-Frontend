import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { ConvenioMedicoResponse } from 'src/app/core/models/convenio-medico/response/ConvenioMedicoResponse';
import { CacheService } from 'src/app/shared/services/cache.service';

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
}
