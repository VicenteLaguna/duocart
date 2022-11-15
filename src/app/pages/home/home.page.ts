import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserI } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  //variables de usuario que recibirá los datos que vienen desde login:
  usuario: any;
  rol: 'conductor' | 'pasajero'
  constructor(private fire:FirebaseService, private activateRoute: ActivatedRoute, private router: Router, private usuarioService: UsuarioService,private auth:AuthService) {
    this.auth.stateUser().subscribe(res =>{
      if (res) {
          console.log('Está logeado');
          this.getDatosUser(res.uid);
      }else{
        console.log('no está logeado');
      }
    })
  }

  ngOnInit(){
    //this.usuario = this.router.getCurrentNavigation().extras.state.usuario;
  }

  //método para logout:
  logout(){
    this.usuarioService.logout();
  }

  getDatosUser(uid:string){
    const path = 'Usuarios';
    const id = uid;
    this.fire.getDoc<UserI>(path,id).subscribe(res =>{
      console.log('datos',res);
      if(res){
        this.rol = res.perfil
      }
    })

  }
}
