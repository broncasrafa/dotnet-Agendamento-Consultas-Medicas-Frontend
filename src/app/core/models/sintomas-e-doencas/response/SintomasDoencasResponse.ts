import { EspecialidadeResponse } from "src/app/core/models/especialidade/response/EspecialidadeResponse"

export class SintomasDoencasResponse {
  id: number
  code: string
  nome: string
  term: string
  descricao: string
  especialidades: EspecialidadeResponse[]
}
