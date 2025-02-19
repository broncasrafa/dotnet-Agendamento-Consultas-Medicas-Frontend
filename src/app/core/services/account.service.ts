import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/core/models/ApiResponse';
import { LoginRequest } from 'src/app/core/models/account/request/LoginRequest';
import { RegisterPacienteRequest } from 'src/app/core/models/account/request/RegisterPacienteRequest';
import { RegisterEspecialistaRequest } from 'src/app/core/models/account/request/RegisterEspecialistaRequest';
import { RegisterRequest } from 'src/app/core/models/account/request/RegisterRequest';
import { ForgotPasswordRequest } from 'src/app/core/models/account/request/ForgotPasswordRequest';
import { ResetPasswordRequest } from 'src/app/core/models/account/request/ResetPasswordRequest';
import { ChangePasswordRequest } from 'src/app/core/models/account/request/ChangePasswordRequest';
import { UpdateAuthenticatedUserInfoRequest } from 'src/app/core/models/account/request/UpdateAuthenticatedUserInfoRequest';
import { AuthenticatedUserResponse } from 'src/app/core/models/account/response/AuthenticatedUserResponse';
import { CredentialsSessionKeys } from '../constants/credentials-session-keys.const';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private base_api_url = environment.api_url + '/account';

  constructor(private http: HttpClient) { }


  /**
   * Realizar o login do usuário na plataforma
   * @param request Dados de acesso do usuário.
   * @returns Observable<ApiResponse<AuthenticatedUserResponse>> dados do usuário autenticado.
   */
  login(request: LoginRequest): Observable<ApiResponse<AuthenticatedUserResponse>> {
    return this.http.post<ApiResponse<AuthenticatedUserResponse>>(`${this.base_api_url}/login`, request);
  }

  /**
   * Realizar o logout do usuário na plataforma
   * @returns true se o logout foi realizado com sucesso.
   */
  logout(): Observable<ApiResponse<boolean>> {
    sessionStorage.removeItem(CredentialsSessionKeys.ACCESS_TOKEN);
    sessionStorage.removeItem(CredentialsSessionKeys.USER_INFO);
    return of({ success: true, data: true, message: 'Logout realizado com sucesso.' });
  }

  /**
   * Registra um novo paciente na API.
   * @param request Dados do paciente a ser cadastrado.
   * @returns Observable<ApiResponse<boolean>> indicando sucesso ou falha.
   */
  registerPaciente(request: RegisterPacienteRequest): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${this.base_api_url}/register/pacientes`, request);
  }

  /**
   * Registra um novo especialista na API.
   * @param request Dados do especialista a ser cadastrado.
   * @returns Observable<ApiResponse<boolean>> indicando sucesso ou falha.
   */
  registerEspecialista(request: RegisterEspecialistaRequest): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${this.base_api_url}/register/especialistas`, request);
  }

  /**
   * Registra um novo usuário (Adm ou Consultor) na API.
   * @param request Dados do usuário a ser cadastrado.
   * @returns Observable<ApiResponse<boolean>> indicando sucesso ou falha.
   */
  registerUser(request: RegisterRequest): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${this.base_api_url}/register`, request);
  }

  /**
   * Receber o código de reset de senha
   * @param request Dados do e-mail do usuário para receber o código de reset de senha.
   * @returns Observable<ApiResponse<boolean>> indicando sucesso ou falha.
   */
  forgotPassword(request: ForgotPasswordRequest): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${this.base_api_url}/forgot-password`, request);
  }

  /**
   * Resetar a senha do usuário, receber a troca de senha informando o código de reset de senha
   * @param request Dados do e-mail, código de reset e nova senha do usuário.
   * @returns Observable<ApiResponse<boolean>> indicando sucesso ou falha.
   */
  resetPassword(request: ResetPasswordRequest): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${this.base_api_url}/reset-password`, request);
  }

  /**
   * Realizar a alteração de senha do usuário logado
   * @param request Dados da senha antiga e nova senha do usuário.
   * @returns Observable<ApiResponse<boolean>> indicando sucesso ou falha.
   */
  changeUserLoggedPassword(request: ChangePasswordRequest): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${this.base_api_url}/change-password`, request);
  }

  /**
   * Obter os dados do usuário logado na plataforma
   * @returns Observable<ApiResponse<AuthenticatedUserResponse>> os dados do usuário logado.
   */
  getUserLoggedInfo(): Observable<ApiResponse<AuthenticatedUserResponse>> {
    return this.http.get<ApiResponse<AuthenticatedUserResponse>>(`${this.base_api_url}/manage/info`);
  }

  /**
   * Atualizar os dados do usuário logado na plataforma
   * @param request Dados do usuário logado.
   * @returns Observable<ApiResponse<boolean>> indicando sucesso ou falha.
   */
  updateUserLoggedInfo(request: UpdateAuthenticatedUserInfoRequest): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${this.base_api_url}/manage/info`, request);
  }

  /**
   * Deleta os dados do usuário logado na plataforma
   * @returns Observable<ApiResponse<boolean>> indicando sucesso ou falha.
   */
  deleteUserLoggedInfo(): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.base_api_url}/manage/info`);
  }
}
