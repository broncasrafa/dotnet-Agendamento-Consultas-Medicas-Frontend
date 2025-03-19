import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private secretKey = "lL5trN88NRvfUgKgWaE8pOnY3NBIusk0EkWuWhbr2XHAhuhv9/i6DTOq/GFy73gaBQGLHjgcrM7PBSflWXLxqWROoxHAEQ+5JUsnwBqSJyG+0c1sSRY03HbxnNgghsgfZC7yeRXDuUHTA+LRe8PGQxhbyh2/gNJiKi9ne5y8oMKG+1W3ZVFn4W4s/EDkBl/N15KSS+gS20hck53zm5U0UVRdUjjsl6YLK/MZ4L1bk22mlrC4c67/c1gmvLz4I/NB21ZwQyJewZheg0vVsumtG6TD+eOYvmSs7xyDwtfJI2vP7BInXbgEbmXpjJL70M4+erOXcEW2Um0t5e/otHRtHTu7jVzW340VzJoPZ+Yco1TUn5Ki+2GeylybAsgWhNa9TO96dOpkYwiefxJ2ph6hjtYCmj1fXQZ/h0A6XSl+FJOp+kcndYy2ohTnspqP7tHv6reM02dW5NZf7YJBtdZTV1NQ7p/9r0odNp4Mr2L4lqyaddp3w/QVwsBzP58a1NtCxkmO1ctiDoumoqKwaPVjgA==";

  constructor() { }

  /**
   * Função para criptografar e tornar seguro para URL
   * @param dados objeto para criptografar
   * @returns string criptografada
   */
  criptografar(dados: any): string {
    const jsonString = JSON.stringify(dados); // Converte o objeto para string JSON
    const encrypted = CryptoJS.AES.encrypt(jsonString, this.secretKey).toString();
    return btoa(encrypted) // Converte para Base64
      .replace(/\+/g, '-') // Substitui + por -
      .replace(/\//g, '_') // Substitui / por _
      .replace(/=+$/, ''); // Remove = para evitar problemas na URL
  }

  /**
   * Função para descriptografar um objeto
   * @param dadosCriptografados string criptografada
   * @returns objeto descriptografado
   */
  descriptografar(dadosCriptografados: string): any {
    try {
      const base64 = dadosCriptografados
        .replace(/-/g, '+')
        .replace(/_/g, '/'); // Restaura os caracteres removidos para URL
      const decrypted = CryptoJS.AES.decrypt(atob(base64), this.secretKey).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted); // Converte de volta para objeto JSON
    } catch (e) {
      console.error('Erro ao descriptografar:', e);
      return null;
    }
  }
}
