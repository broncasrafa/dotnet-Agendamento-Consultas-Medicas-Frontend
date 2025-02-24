export class CreatePerguntaRequest {
  especialidadeId: number;
  pacienteId: number;
  pergunta: string;
  termosUsoPolitica: boolean;

  constructor(especialidadeId: number, pacienteId: number, pergunta: string, termosUsoPolitica: boolean) {
    this.especialidadeId = especialidadeId;
    this.pacienteId = pacienteId;
    this.pergunta = pergunta;
    this.termosUsoPolitica = termosUsoPolitica;
  }
}
