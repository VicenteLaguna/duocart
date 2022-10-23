import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  //variables de usuario que recibirá los datos que vienen desde login:
  usuario: any;
  cantidad : number;

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  ngOnInit(){
    this.usuario = this.router.getCurrentNavigation().extras.state.usuario;
  }

  //método para logout:
  logout(){
    this.usuarioService.logout();
  }

}
