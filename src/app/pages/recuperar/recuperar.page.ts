import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {

  email:string='';

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit() {
  }

  recuperar(){
    if (this.usuarioService.validarCorreo(this.email) != undefined) {
      alert('Se ha enviado la nueva contraseña a tu correo!');
      this.email = '';
      this.router.navigate(['/login']);
    }else{
      alert('Correo incorrecto!');
    }
  }
}
