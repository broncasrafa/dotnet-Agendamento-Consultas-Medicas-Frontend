export interface AuthenticatedUserResponse {
  credentials: Credentials
  usuario: Usuario
}


export interface Usuario {
  token: string
  id: string
  nome: string
  documento: string
  username: string
  email: string
  telefone: string
  isActive: boolean
  createdAt: string
}

export interface Credentials {
  token: string
  refreshToken: string
}
