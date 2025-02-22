import { Component } from '@angular/core';

@Component({
  selector: 'app-mudar-senha',
  standalone: true,
  imports: [],
  templateUrl: './mudar-senha.component.html',
  styleUrl: './mudar-senha.component.css'
})
export class MudarSenhaComponent {

}
// obter do searchParams o email e o codigo de reset de senha
// enviar na requisição o email, o codigo e a nova senha
