import { PlanosMedicoResponse } from "./PlanosMedicoResponse"

export class PacienteDependenteResponse {
  id: number
  nome: string
  email: string
  telefone: string
  genero: string
  cpf: string
  dataNascimento: string
  ativo: boolean
  planosMedicos: PlanosMedicoResponse[]
}
