import { EspecialidadeResponse } from "src/app/core/models/especialidade/response/EspecialidadeResponse"

export class EspecialistaResponse {
  id: number
  nome: string
  licenca: string
  foto: string
  avaliacao?: number
  especialidades: EspecialidadeResponse[]
}
