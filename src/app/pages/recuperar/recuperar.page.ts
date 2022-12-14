import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { InteractionService } from 'src/app/services/interaction.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {

  email:string;

  constructor(private afAuth: AngularFireAuth, private router: Router, private interaction: InteractionService) { }

  ngOnInit() {
  }

  // recuperar(){
  //   if (this.usuarioService.validarCorreo(this.email) != undefined) {
  //     alert('Se ha enviado la nueva contraseña a tu correo!');
  //     this.email = '';
  //     this.router.navigate(['/login']);
  //   }else{
  //     alert('Correo incorrecto!');
  //   }
  // }


  async resetPassword(){
    if(this.email){
      this.interaction.presentLoading('Enviando nueva contraseña...')
      this.afAuth.sendPasswordResetEmail(this.email).then(()=>{
        this.interaction.closeLoading();
        console.log('Correcto');
        this.interaction.presentToast('Por favor, revisa tu correo.')
        this.router.navigate(['/login']);
        
      })
      .catch((error)=>{
        console.log(error.message);
        
      })
    }else{
      console.log('Por favor ingresa tu correo!');
      
      this.interaction.presentToast('Por favor, ingresa tu correo!')
    }
  }
  
}
