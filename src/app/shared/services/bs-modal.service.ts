import { Injectable } from '@angular/core';
import { Modal } from 'bootstrap';

@Injectable({
  providedIn: 'root'
})
export class BsModalService {

  private modalInstance?: Modal | null;
  private dadosModal: any = null;

  abrirModal(modalId: string, dados?: any) {
    if (dados) {
      this.dadosModal = dados; // Armazena os dados
    }

    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
      this.modalInstance.show();
      //this.isModalFechado = false;
    }
  }

  fecharModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement && this.modalInstance) {
      this.modalInstance.hide();
      this.modalInstance = null; // Reseta a instância do modal
      this.dadosModal = null;
      document.body.focus();
      //this.isModalFechado = true;
    }
  }

  getDadosModal(): any {
    return this.dadosModal;
  }
}
