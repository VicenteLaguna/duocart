import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  datos: any[]=[];
  dato: any;

  constructor(private storage: Storage) {
    storage.create();
   }
   //métodos del crud para el storage
   async agregar(key, dato){
    this.dato = await this.storage.get(key)||[];

    this.dato = await this.getDato(key, dato.rut);
    if(this.dato == undefined){
      this.datos.push(dato);
      await this.storage.set(key, this.datos);
      return true;
    }
    return false;
   }
  async getDato(key, identificador) {
    this.datos = await this.storage.get(key) || [];
    this.dato = this.datos.find(usuario => usuario.rut == identificador);
    return this.dato;
  }

  async getDatos(key): Promise<any[]>{
    this.datos = await this.storage.get(key);
    return this.datos;
  }

  async eliminar(key, dato) {
    this.datos = await this.storage.get(key) || [];
    this.datos.forEach((value, index) => {
      if (value.rut == dato) {
        this.datos.splice(index, 1);
      }
    });
    await this.storage.set(key, this.datos);
  }
  
  async actualizar(key, dato) {
    this.datos = await this.storage.get(key) || [];
    
    var index = this.datos.findIndex(persona => persona.rut == dato.rut);
    this.datos[index] = dato;

    await this.storage.set(key, this.datos);
  }
}
