import { PacienteDependenteResponse } from "./PacienteDependenteResponse"
import { PlanosMedicoResponse } from "./PlanosMedicoResponse"

export class PacienteResponse {
  id: number
  nome: string
  telefone: string
  email: string
  cpf: string
  telefoneVerificado: boolean
  termoUsoAceito: boolean
  genero: string
  dataNascimento: string
  createdAt: string
  updatedAt: string
  ativo: boolean
  dependentes: PacienteDependenteResponse[]
  planosMedicos: PlanosMedicoResponse[]
}
