export interface CreateAgendamentoRequest {
  especialistaId: number
  especialidadeId: number
  localAtendimentoId: number
  tipoConsultaId: number
  tipoAgendamentoId: number
  dataConsulta: string
  horarioConsulta: string
  motivoConsulta: string
  valorConsulta: number
  telefoneContato: string
  primeiraVez: boolean
  pacienteId: number
  dependenteId: number
  planoMedicoId: number
}
