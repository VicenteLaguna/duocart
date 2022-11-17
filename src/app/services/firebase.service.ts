import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  isAuthenticated = new BehaviorSubject(false);
  datos: any[] = [];

  constructor(private fire: AngularFirestore) { }

  agregar(coleccion, value){
    //coleccion: nosotros conociamos como KEY de storage, nombre de una tabla..
    try {
      return this.fire.collection(coleccion).add(value);
    } catch (error) {
      console.log('ERROR: ', error)
    }
  }

  getDatos(colleccion){
    try {
      return this.fire.collection(colleccion).snapshotChanges();
    } catch (error) {
      console.log('ERROR: ', error)
    }
  }
  /* getDatos2(colleccion){
    try {
      this.fire.collection(colleccion).snapshotChanges().subscribe(
        data => {
          this.datos = [];
          for(let d of data){
            this.datos.push(d.payload.doc.data());
          }
        }
      );
    } catch (error) {
      console.log('ERROR: ', error)
    }
  } */

  eliminar(coleccion, identificador){
    try {
      this.fire.collection(coleccion).doc(identificador).delete();
    } catch (error) {
      console.log('ERROR: ', error)
    }
  }

  getDato(coleccion, identificador){
    try {
      return this.fire.collection(coleccion).doc(identificador).get();
    } catch (error) {
      console.log('ERROR: ', error);
    }
  }

  modificar(coleccion, identificador, value){
    try {
      this.fire.collection(coleccion).doc(identificador).set(value);
    } catch (error) {
      console.log('ERROR: ', error)
    }
  }

  login(email, password): boolean{
    for(let u of this.datos){
      if(u.email == email && u.password == password){
        this.isAuthenticated.next(true);
        return true;
      }
    }
    return false;
  }


  createDoc(data: any, path: string, id: string){
    const collection = this.fire.collection(path);
    return collection.doc(id).set(data);
  }

  getDoc<tipo>(path: string, id: string){
    return this.fire.collection(path).doc<tipo>(id).valueChanges()
  }

  getId(){
    return this.fire.createId();
  }

  getCollection<tipo>(path: string){
    const collection = this.fire.collection<tipo>(path);
    return collection.valueChanges();
  }

  deleteDoc(path: string, id:string){
    return this.fire.collection(path).doc(id).delete();
  }

  updateDoc(path: string, id: string, data: any){
    return this.fire.collection(path).doc(id).update(data);
  }
}

