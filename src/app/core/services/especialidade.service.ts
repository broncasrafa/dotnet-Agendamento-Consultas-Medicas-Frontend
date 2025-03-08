import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { EspecialidadeResponse } from 'src/app/core/models/especialidade/response/EspecialidadeResponse';
import { CacheService } from 'src/app/shared/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadeService {

  private readonly base_api_url = environment.api_url + '/especialidades';

  constructor(private http: HttpClient, private cacheService: CacheService) { }

  /**
   * Obtém a lista de especialidades, utilizando o cache sempre que possível.
   */
  getEspecialidades(): Observable<EspecialidadeResponse[]> {
    const cache = this.cacheService.getItem<EspecialidadeResponse[]>(this.cacheService.keys.especialistas);

    // Se o cache estiver preenchido, retorna o Observable com os dados do cache
    if (cache) {
      return of(cache);
    }

    // Se não estiver no cache, faz a requisição à API
    return this.http.get<ApiResponse<EspecialidadeResponse[]>>(this.base_api_url, { responseType: 'json' }).pipe(
      map(response => response.data ?? []),  // Extraímos os dados da resposta
      tap((especialidades) => {
        // Armazenamos o resultado no cache
        if (especialidades.length) {
          this.cacheService.setItem(this.cacheService.keys.especialistas, especialidades);
        }
      })
    );
  }
}
