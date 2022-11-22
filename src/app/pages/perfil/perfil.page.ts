import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserI } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  valor: any;
  newImage='';

  constructor(private router: Router, 
    private auth: AuthService,
    private interaction : InteractionService,
    private fire : FirebaseService,
    private alertController : AlertController,
    public fireStorageService: FirestorageService) { }

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

  async logout(){
    await this.interaction.presentLoading('Cerrando sersión');
    this.auth.logout();
    this.router.navigate(['/login']);
    this.interaction.closeLoading();
  }

 
  async saveAtributo(name: string, input: any){
    await this.interaction.presentLoading('Actualizando...');
    const path = 'Usuarios'
    const id = this.uid;
    const updateDoc={
    };
    updateDoc[name] = input;
    this.fire.updateDoc(path,id,updateDoc).then(() =>{
      this.interaction.presentToast('actualizado con exito')
      this.interaction.closeLoading();
    })
  }

  async editAtributo(name: string) {
    const alert = await this.alertController.create({
      header: 'Editar '+ name,
      buttons: [{
        text: 'Confirmar',
        handler: (ev) => {
          console.log('Confirm ok--', ev);
          this.saveAtributo(name,ev[name])
        }
      },{
        text:'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler:()=>{
          console.log('cancel');
          
        }
      }
    ],
      inputs: [
        {
          name,
          placeholder: 'Ingresa tu '+ name,
          attributes: {
            maxlength: 30,
          },
        }
      ],
    });
  
    await alert.present();
  }



}
