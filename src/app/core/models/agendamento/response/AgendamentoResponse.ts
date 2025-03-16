import { EspecialistaResponse } from "src/app/core/models/especialista/response/EspecialistaResponse"
import { EspecialidadeResponse } from "src/app/core/models/especialidade/response/EspecialidadeResponse"
import { EspecialistaLocalAtendimentoResponse } from "src/app/core/models/especialista/response/LocaisAtendimentoResponse"

export class AgendamentoResponse {
  id: number
  agendamentoDependente: boolean
  telefoneContato: string
  motivoConsulta: string
  dataConsulta: string
  horarioConsulta: string
  valorConsulta: number
  primeiraVez: boolean
  duracaoEmMinutosConsulta: number
  observacoes: string
  notaCancelamento: string
  createdAt: string
  confirmedByPacienteAt: string
  confirmedByEspecialistaAt: string
  updatedAt: string
  statusConsulta: string
  tipoConsulta: string
  tipoAgendamento: string
  paciente: string
  cpf: string
  email: string
  metodoPagamento: string
  numeroCarteirinha: string
  profissional: EspecialistaResponse
  especialidade: EspecialidadeResponse
  localAtendimento: EspecialistaLocalAtendimentoResponse
}
