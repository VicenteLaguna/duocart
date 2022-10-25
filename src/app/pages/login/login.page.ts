import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  //vamos a crear las variables necesarias:
  credenciales = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@(duoc|duocuc|profesor.duoc).(cl)')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(18)])
  });

  constructor(private toastController: ToastController, private router: Router, 
    private usuarioService: UsuarioService, private storage: StorageService) { }

   ngOnInit() {

  }
  
  //método para ingresar a home:
  async ingresar() {
    //rescatamos las variables del formulario por separado:
    var correoValidar = this.credenciales.controls.email.value;
    var claveValidar = this.credenciales.controls.password.value;

    //rescatamos el usuario con el método login usuario:
    var usuarioLogin = this.usuarioService.loginUsuario(correoValidar, claveValidar);
    //validamos si existe el usuario
    if (usuarioLogin != undefined) {
      //UNA VEZ QUE VALIDO QUE EXISTE, ENVIARE ESOS DATOS A LA SIGUIENTE PÁGINA:
      let navigationExtras: NavigationExtras = {
        state: {
          usuario: usuarioLogin
        }
      };

      //PARA ENVIAR EL DATO QUE ESTA LISTO, SE ANEXA AL ROUTER!
      let resp = await this.storage.agregar('credenciales',this.credenciales.value);
      this.credenciales.reset();
      this.router.navigate(['/home/portada'], navigationExtras);

    } else {
      alert('Usuario o contraseña incorrectos!')
    }
  }

}
