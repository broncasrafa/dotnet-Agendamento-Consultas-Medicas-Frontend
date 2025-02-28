import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { LoginRequest } from 'src/app/core/models/account/request/LoginRequest';
import { AuthenticatedUserResponse, Usuario } from 'src/app/core/models/account/response/AuthenticatedUserResponse';
import { CredentialsSessionKeys } from 'src/app/core/constants/credentials-session-keys.const';
import { StringExtensions } from 'src/app/core/extensions/string.extensions';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private base_api_url = environment.api_url + '/account';

  private loggedIn: BehaviorSubject<boolean>; // BehaviorSubject para monitorar o estado de login
  private refreshTokenTimeout: any; // Armazena o timeout para renovação do token

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private jwtHelper: JwtHelperService) {
    // Inicializa o BehaviorSubject com o estado atual do token
    this.loggedIn = new BehaviorSubject<boolean>(this.isTokenValid());
  }

  // Método chamado ao inicializar o serviço
  ngOnInit(): void {
    this.verifyToken(); // Verifica o estado do token
}

  /**
   * Realizar o login do usuário na plataforma
   * @param request - Dados da credenciais do usuário
   * @returns Observable<ApiResponse<AuthenticatedUserResponse>> dados do usuário autenticado.
  */
  login(request: LoginRequest): Observable<ApiResponse<AuthenticatedUserResponse>> {
    return this.http.post<ApiResponse<AuthenticatedUserResponse>>(`${this.base_api_url}/login`, request)
      .pipe(
        map(response => {
          if (response && response.data) {
            this.storeTokens(response.data!.credentials.token, response.data!.credentials.refreshToken);
            this.storeUserInfo(response.data!.usuario);
            this.loggedIn.next(true); // Atualiza o estado de login
            // this.startRefreshTokenTimer(); // Inicia o temporizador para renovação do token
          }

          return response;
        })
      );
  }

  /**
   * Informa se o usuário está logado na plataforma
   * @returns boolean indicando se o usuário está logado ou não.
   */
  isLoggedIn(): boolean {
    const JWT_TOKEN = StringExtensions.isNullOrEmpty(this.cookieService.get(CredentialsSessionKeys.JWT_TOKEN))
                        ? localStorage.getItem(CredentialsSessionKeys.JWT_TOKEN)
                        : this.cookieService.get(CredentialsSessionKeys.JWT_TOKEN);
    return JWT_TOKEN ? true : false;
  }

  /**
   * Verifica se o usuário está autenticado
   * @returns Observable<boolean> - Estado de login do usuário
   */
  isAuthenticated(): Observable<boolean> {
    return this.loggedIn.asObservable(); // Retorna o estado de login como um Observable
  }

  /**
   * Realizar o logout do usuário na plataforma
   * @returns true se o logout foi realizado com sucesso.
   */
  logout(): Observable<ApiResponse<boolean>> {
    this.clearTokens();
    this.loggedIn.next(false); // Atualiza o estado de login
    this.stopRefreshTokenTimer(); // Para o temporizador de renovação do token
    return of({ success: true, data: true, message: 'Logout realizado com sucesso.' });
  }

  /**
     * Obter as informações do usuário no localStorage
     * @param data - Dados do usuário
     */
  getUserInfo(): Usuario {
    return JSON.parse(localStorage.getItem(CredentialsSessionKeys.USER_INFO)!) as Usuario;
  }

  /**
   * Obtém o token armazenado no localStorage
   * @returns string | null - Token JWT ou null se não existir
   */
  getToken(): string | null {
    return localStorage.getItem(CredentialsSessionKeys.JWT_TOKEN); // Retorna o token JWT
  }


  /**
   * Limpa os tokens do localStorage e do cookie
   */
  private clearTokens(): void {
    localStorage.removeItem(CredentialsSessionKeys.JWT_TOKEN); // Remove o token JWT
    localStorage.removeItem(CredentialsSessionKeys.REFRESH_TOKEN); // Remove o token de refresh
    localStorage.removeItem(CredentialsSessionKeys.USER_INFO); // Remove as informações do usuario
    // Limpar cookies
    const cookies = this.cookieService.getAll();
    for (const cookie in cookies) {
      this.cookieService.delete(cookie);
    }
  }

  /**
   * Armazena os tokens no localStorage e no cookie
   * @param token - Token JWT
   * @param refreshToken - Token de refresh
   */
  private storeTokens(token: string, refreshToken: string): void {
    localStorage.setItem(CredentialsSessionKeys.JWT_TOKEN, token);
    localStorage.setItem(CredentialsSessionKeys.REFRESH_TOKEN, refreshToken);

    this.cookieService.set(CredentialsSessionKeys.JWT_TOKEN, token);
    this.cookieService.set(CredentialsSessionKeys.REFRESH_TOKEN, refreshToken);
  }

  /**
     * Armazena as informações do usuário no localStorage e no cookie
     * @param data - Dados do usuário
     */
  private storeUserInfo(data: any): void {
    localStorage.setItem(CredentialsSessionKeys.USER_INFO, JSON.stringify(data));
    // this.cookieService.set(CredentialsSessionKeys.COOKIE_USER_INFO, data);
  }



  /**
     * Verifica o estado do token ao inicializar o serviço
     */
  private verifyToken(): void {
    const token = this.getToken(); // Obtém o token armazenado
    if (token && this.jwtHelper.isTokenExpired(token)) { // Se o token está expirado
        this.logout(); // Realiza o logout
    } else if (token) { // Se o token é válido
        this.loggedIn.next(true); // Atualiza o estado de login
        this.startRefreshTokenTimer(); // Inicia o temporizador para renovação do token
    }
}

  /**
     * Verifica se o token é válido
     * @returns boolean - True se o token é válido, False se não for
     */
  private isTokenValid(): boolean {
    const token = this.getToken(); // Obtém o token armazenado
    return !!token && !this.jwtHelper.isTokenExpired(token); // Verifica se o token é válido e não está expirado
  }

  /**
     * Renova o token de acesso usando o refresh token
     * @returns Observable<any> - Resposta da requisição de renovação do token
     */
  private refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem(CredentialsSessionKeys.REFRESH_TOKEN); // Obtém o refresh token armazenado
    return this.http.post<any>(`${this.base_api_url}/refresh-token`, { refreshToken }).pipe(
      map(response => {
        if (response && response.data.token) { // Se a resposta contém um novo token
          this.storeTokens(response.data.token, response.data.refreshToken); // Armazena os novos tokens
          this.startRefreshTokenTimer(); // Reinicia o temporizador para renovação do token
        }
        return response; // Retorna a resposta
      }),
      catchError(error => {
        this.logout(); // Realiza o logout em caso de erro
        return throwError(() => new Error(error)); // Lança o erro
      })
    );
  }

  /**
     * Inicia o temporizador para renovação do token de acesso
     */
  private startRefreshTokenTimer(): void {
    const token = this.getToken(); // Obtém o token de acesso armazenado
    if (token) {
      const expires = this.jwtHelper.getTokenExpirationDate(token)?.getTime() ?? 0; // Obtém o tempo de expiração do token
      const timeout = expires - Date.now() - (60 * 1000); // Define o timeout para 1 minuto antes de expirar
      this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout); // Inicia o temporizador para renovação do token
    }
  }

  /**
   * Para o temporizador de renovação do token de acesso
   */
  private stopRefreshTokenTimer(): void {
    clearTimeout(this.refreshTokenTimeout); // Limpa o timeout
  }
}
