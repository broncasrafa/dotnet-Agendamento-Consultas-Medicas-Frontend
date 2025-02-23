export class RegisterEspecialistaRequest {
  nomeCompleto: string
  username: string
  email: string
  tipoCategoria: string
  especialidadeId: number
  genero: string
  licenca: string
  telefone: string
  password: string
  confirmPassword: string

  constructor(
    nomeCompleto: string,
    username: string,
    email: string,
    tipoCategoria: string,
    especialidadeId: number,
    genero: string,
    licenca: string,
    telefone: string,
    password: string,
    confirmPassword: string
  ) {
    this.nomeCompleto = nomeCompleto;
    this.username = username;
    this.email = email;
    this.tipoCategoria = tipoCategoria;
    this.especialidadeId = especialidadeId;
    this.genero = genero;
    this.licenca = licenca;
    this.telefone = telefone;
    this.password = password;
    this.confirmPassword = confirmPassword;
  }
}
