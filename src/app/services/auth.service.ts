import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject } from 'rxjs';
import { UserI } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLogged: any = false;
  isAuthenticated = new BehaviorSubject(false);
  constructor(public afAuth: AngularFireAuth) {
    afAuth.authState.subscribe(user => (this.isLogged = user));
   }
//login
login (email: string, password:string){
  return this.afAuth.signInWithEmailAndPassword(email,password);
}

logout(){  
  this.afAuth.signOut();
  
}

registrarUser(datos: UserI){
  return this.afAuth.createUserWithEmailAndPassword(datos.correo,datos.password);
}
//Estado de identificacion del usuario
stateUser(){
  return this.afAuth.authState
}

async getUid(){
  const user = await this.afAuth.currentUser;
  if(user){
    return user.uid;
  }else{
    return null;
  }
  }
}

