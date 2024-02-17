import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  constructor(public _chat: ChatService ) { }

  ingresar(proveedor:string){
    this._chat.login(proveedor);
  }

}
