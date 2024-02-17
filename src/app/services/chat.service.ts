import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Mensaje } from '../models/mensaje.model';
import { GoogleAuthProvider, GithubAuthProvider, signInWithEmailAndPassword } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private itemsCollection!: AngularFirestoreCollection<Mensaje>;
  public chats: Mensaje[] = [];
  public usuario: any = {};

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((user: any | null) => {
      if (user) {
        this.usuario.nombre = user.displayName;
        this.usuario.id = user.uid;
        this.usuario.foto = user.photoURL;
      }
    });
  }

  login(proveedor: string) {
    let provider;

    if (proveedor === 'google') {
      provider = new GoogleAuthProvider();
    } else {
      provider = new GithubAuthProvider();
    }

    this.afAuth.signInWithPopup(provider)
      .then((result:any) => {
        // Puedes acceder a la información del usuario desde result.user
        console.log(result.user);
      })
      .catch((error:any) => {
        console.error('Error en el inicio de sesión:', error);
      });
  }

  logout() {
    // Restaurar las propiedades del usuario
    this.usuario = {};
    this.afAuth.signOut();
  }

  cargarMensajes() {
    this.itemsCollection = this.afs.collection<Mensaje>('chats', (ref: any) => ref.orderBy('fecha', 'desc').limit(5));
    return this.itemsCollection.valueChanges().pipe(
      map((mensajes: Mensaje[]) => {
        this.chats = [];
        for (const mensaje of mensajes) {
          this.chats.unshift(mensaje);
        }
        return this.chats;
      })
    );
  }

  agregarMensaje(texto: string) {
    // Objeto que se enviará a Firebase
    const mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      id: this.usuario.id,
      foto: this.usuario.foto
    };

    // Insertamos los datos en la colección
    return this.itemsCollection.add(mensaje);
  }
}
