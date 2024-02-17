import { Component, OnInit } from '@angular/core';
import { version } from '../../../../package.json';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  mensaje: string = "";
  elemento: any;
  appVersion: string = version;

  constructor(public _chat: ChatService) {
    this._chat.cargarMensajes()
      .subscribe(() => {
        setTimeout(() => {
          if (this.elemento !== null){
            this.elemento.scrollTop = this.elemento.scrollHeight;
          }
        }, 20);
      });
  }

  ngOnInit() {
    this.elemento = document.getElementById('app-mensajes');
  }

  enviarMensaje() {
    if (this.mensaje.length === 0) {
      return;
    } else {
      this._chat.agregarMensaje(this.mensaje)
        .then(() => {
          this.mensaje = "";
        })
        .catch((err: any) => {
          console.error('Error al enviar mensaje.', err);
        });
    }
  }

  getBadgeColor(senderId: any): string {
    // Convierte el ID a un número entero antes de calcular el índice del color
    const numericId = parseInt(senderId, 10);

    // Verifica si la conversión fue exitosa y si es un número finito
    if (!isNaN(numericId) && isFinite(numericId)) {
      const colors = ['basic', 'primary', 'accent', 'warn' ];
      const index = numericId % colors.length;
      return colors[index];
    } else {
      return 'basic'; // o el color predeterminado que prefieras
    }
  }
}
