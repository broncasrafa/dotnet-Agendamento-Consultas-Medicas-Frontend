import { RespostaResponse } from "src/app/core/models/perguntas-respostas/response/RespostaResponse"
import { EspecialidadeResponse } from "src/app/core/models/especialidade/response/EspecialidadeResponse"

export class PerguntaResponse {
  id: number
  pergunta: string
  createdAt: string
  createdAtFormatted: string
  pacienteNome: string
  totalRespostas: number
  especialidade: EspecialidadeResponse
  respostas?: RespostaResponse[]
}
