import { EspecialistaResponse } from "src/app/core/models/especialista/response/EspecialistaResponse"
import { RespostaLikeDislikeResponse } from "src/app/core/models/perguntas-respostas/response/RespostaLikeDislikeResponse"

export class RespostaResponse {
  id: number
  resposta: string
  createdAt: string
  createdAtFormatted: string
  likes: number
  dislikes: number
  likedByCurrentUser?: boolean
  likesCount: number
  especialista: EspecialistaResponse
  pacientesLikeDislike: RespostaLikeDislikeResponse[]
}
