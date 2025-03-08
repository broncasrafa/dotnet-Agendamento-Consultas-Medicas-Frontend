import { EspecialidadeResponse } from "src/app/core/models/especialidade/response/EspecialidadeResponse"
import { EspecialistaLocalAtendimentoResponse } from "src/app/core/models/especialista/response/LocaisAtendimentoResponse"
import { ConvenioMedicoResponse } from "src/app/core/models/convenio-medico/response/ConvenioMedicoResponse"
import { EspecialistaAvaliacaoResponse } from "src/app/core/models/especialista/response/EspecialistaAvaliacaoResponse"
import { EspecialistaPerguntaResponse } from "src/app/core/models/especialista/response/EspecialistaPerguntaResponse"

export class EspecialistaResponse {
  id: number
  nome: string
  licenca: string
  foto: string
  avaliacao?: number
  tipo: string
  agendaOnline: boolean
  perfilVerificado: boolean
  permitirPergunta: boolean
  telemedicinaOnline: boolean
  telemedicinaAtivo: boolean
  telemedicinaPreco: string
  telemedicinaPrecoNumber: number
  genero: string
  tratamento: string
  experienciaProfissional?: string
  formacaoAcademica?: string
  locaisAtendimento: EspecialistaLocalAtendimentoResponse[]
  especialidades: EspecialidadeResponse[]
  conveniosMedicosAtendidos: ConvenioMedicoResponse[]
  avaliacoes: EspecialistaAvaliacaoResponse[]
  perguntasRespostas: EspecialistaPerguntaResponse[]
}
