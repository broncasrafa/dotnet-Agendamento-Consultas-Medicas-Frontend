import { EspecialidadeResponse } from "src/app/core/models/especialidade/response/EspecialidadeResponse";
import { EspecialistaResponse } from "src/app/core/models/especialista/response/EspecialistaResponse";

export class SelectEspecialidadesAndEspecialistasByNameResponse {
  especialidades: EspecialidadeResponse[]
  especialistas: EspecialistaResponse[]
}
