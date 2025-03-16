import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { CidadeResponse } from 'src/app/core/models/common/request/CidadeResponse';
import { CacheService } from 'src/app/shared/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private base_api_url = environment.api_url + '/common';

  private readonly cidadesCacheKey = this.cacheService.keys.cidades; // Chave do cache para cidades

  constructor(private http: HttpClient, private cacheService: CacheService) { }

  getCidadesByFilterName(name: string): Observable<CidadeResponse[]> {
    return this.http.get<ApiResponse<CidadeResponse[]>>(`${this.base_api_url}/cidades/search?name=${name}`, { responseType: 'json'})
              .pipe(
                map(response => response.data ?? [])
              );
  }

  getCidades(): Observable<CidadeResponse[]> {
    const cache = this.cacheService.getItem<CidadeResponse[]>(this.cidadesCacheKey);

    // Se o cache estiver preenchido, retorna o Observable com os dados do cache
    if (cache) {
      return of(cache);
    }

    // Faz a requisição para obter a lista completa e armazena no cache
    return this.http.get<ApiResponse<CidadeResponse[]>>(`${this.base_api_url}/cidades`, { responseType: 'json' })
    .pipe(
      map(response => response.data ?? []),  // Extraímos os dados da resposta
      tap((cidades) => {
        // Armazenamos o resultado no cache
        if (cidades.length) {
          this.cacheService.setItem(this.cacheService.keys.cidades, cidades);
        }
      })
    );
  }
}
