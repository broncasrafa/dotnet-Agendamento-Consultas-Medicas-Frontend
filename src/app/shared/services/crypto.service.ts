import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private secretKey = "lL5trN88NRvfUgKgWaE8pOnY3NBIusk0EkWuWhbr2XHAhuhv9/i6DTOq/GFy73gaBQGLHjgcrM7PBSflWXLxqWROoxHAEQ+5JUsnwBqSJyG+0c1sSRY03HbxnNgghsgfZC7yeRXDuUHTA+LRe8PGQxhbyh2/gNJiKi9ne5y8oMKG+1W3ZVFn4W4s/EDkBl/N15KSS+gS20hck53zm5U0UVRdUjjsl6YLK/MZ4L1bk22mlrC4c67/c1gmvLz4I/NB21ZwQyJewZheg0vVsumtG6TD+eOYvmSs7xyDwtfJI2vP7BInXbgEbmXpjJL70M4+erOXcEW2Um0t5e/otHRtHTu7jVzW340VzJoPZ+Yco1TUn5Ki+2GeylybAsgWhNa9TO96dOpkYwiefxJ2ph6hjtYCmj1fXQZ/h0A6XSl+FJOp+kcndYy2ohTnspqP7tHv6reM02dW5NZf7YJBtdZTV1NQ7p/9r0odNp4Mr2L4lqyaddp3w/QVwsBzP58a1NtCxkmO1ctiDoumoqKwaPVjgA==";

  constructor() { }

  criptografar(dados: any): string {
    const dadosString = JSON.stringify(dados);
    return CryptoJS.AES.encrypt(dadosString, this.secretKey).toString();
  }

  descriptografar(dadosCriptografados: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(dadosCriptografados, this.secretKey);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
      console.error('Erro ao descriptografar:', e);
      return null;
    }
  }
}
