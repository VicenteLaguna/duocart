import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  //variables necesarias para el trabajo del CRUD:
  usuarios: any[] = [
    {
      rut: '11.111.111-1',
      nom_completo: 'Cristo Rey',
      email: 'conductor@duocuc.cl',
      fecha_nac: '1990-03-24',
      password: 'conductor123',
      tipo_usuario: 'conductor'
    },
    {
      rut: '11.111.111-2',
      nom_completo: 'Mortal promedio',
      email: 'pasajero@duocuc.cl',
      fecha_nac: '1990-03-24',
      password: 'pasajero123',
      tipo_usuario: 'pasajero'
    }
  ];

  isAuthenticated = new BehaviorSubject(false);
  
  constructor(private router: Router) { }

  //métodos del CRUD:
  agregarUsuario(usuario): boolean{
    if ( this.obtenerUsuario(usuario.rut) == undefined ) {
      this.usuarios.push(usuario);
      return true;
    }
    return false;
  }
  eliminarUsuario(rut){
    this.usuarios.forEach((usu, index) => {
      if (usu.rut == rut) {
        this.usuarios.splice(index, 1);
      }
    });
  }
  modificarUsuario(usuario){
    var index = this.usuarios.findIndex(usu => usu.rut == usuario.rut);
    this.usuarios[index] = usuario;
  }
  obtenerUsuario(rut){
    return this.usuarios.find(usu => usu.rut == rut);
  }
  obtenerUsuarios(){
    return this.usuarios;
  }

  //MÉTODO CUSTOMER:
  //validar rut y contraseña: método que recibe rut y password y me entrega un JSON de un usuario
  validarRutPassword(rut, password){
    return this.usuarios.find(u => u.rut == rut && u.password == password);
  }

  loginUsuario(email, password) {
    var usuarioLogin: any;
    usuarioLogin = this.usuarios.find(usu => usu.email == email && usu.password == password);
    if (usuarioLogin != undefined) {
      //PARA CAMBIAR EL VALOR A UN BehaviorSubject SE UTILIZA EL METODO .next(valor);
      this.isAuthenticated.next(true);
      return usuarioLogin;
    }
}
getAuth(){
  return this.isAuthenticated.value;
}
logout(){
  this.isAuthenticated.next(false);
  this.router.navigate(['/login']);
}

validarCorreo(email){
  return this.usuarios.find(usu => usu.email == email);
}
}
