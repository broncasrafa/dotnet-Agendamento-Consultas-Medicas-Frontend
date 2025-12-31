import { CidadeResponse } from "src/app/core/models/common/request/CidadeResponse"

export class ConvenioMedicoResponse {
  id: number
  nome: string
  code: string
  cidadesAtendidas: CidadeResponse[]
}
