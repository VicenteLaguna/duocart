import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { UserI } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  valor: any;

  constructor(private router: Router, 
    private auth: AuthService,
    private interaction : InteractionService,
    private fire : FirebaseService) { }

    uid: string = null;
    info: UserI = null;

  async ngOnInit() {
    //this.valor = this.activatedRoute.snapshot.paramMap.get('valor');
    this.getUid();
    this.auth.stateUser().subscribe( res =>{
      console.log('en perfil - estado autenticacion --', res);
      
    })
  }

    async getUid(){
      const uid = await this.auth.getUid();
      if (uid) {
        this.uid = uid;
        console.log('uid --',this.uid);
        this.getInfoUser();
      }else{
        console.log('No existe uid');
      }
    }

    getInfoUser(){
      const path = 'Usuarios';
      const id = this.uid;
      this.fire.getDoc<UserI>(path, id).subscribe(res=>{
        if(res){
          this.info = res;
        }
        console.log('datos son --',res);
      })
    }

  logout(){
    this.interaction.timedLoad('Cerrando sersión');
    this.auth.logout();
    this.router.navigate(['/login']);
  }

 


}
