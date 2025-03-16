import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  /**
   * Objeto para armazenar as chaves utilizadas no sessionStorage
   */
  keys = {
    especialidades: 'especialidades',
    conveniosMedicos: 'conveniosMedicos',
    cidades: 'cidades'
  };

  /**
     * Salva um valor no sessionStorage
     */
  setItem<T>(key: string, value: T): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Recupera um valor do sessionStorage
   */
  getItem<T>(key: string): T | null {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  /**
   * Remove um item do sessionStorage
   */
  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  /**
   * Remove todas as chaves configuradas em `keys` do sessionStorage
   */
  clearAll(): void {
    Object.values(this.keys).forEach((key) => {
      sessionStorage.removeItem(key);
    });
  }

  /**
   * Verifica se a chave existe no sessionStorage
   */
  hasItem(key: string): boolean {
    return sessionStorage.getItem(key) !== null;
  }
}
