import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ValidacionesService } from 'src/app/services/validaciones.service';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AuthService } from 'src/app/services/auth.service';
import { Sedes, UserI } from 'src/app/models/models';
import { InteractionService } from 'src/app/services/interaction.service';
import { FirestorageService } from 'src/app/services/firestorage.service';



@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  //VAMOS A CREAR EL GRUPO DEL FORMULARIO:
  // usuario = new FormGroup({
  //   uid: new FormControl(''),
  //   rut: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9kK]')]),
  //   nom_completo: new FormControl('', [Validators.required, Validators.minLength(3)]),
  //   email: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@(duocuc|duoc|profesor.duoc).(cl)')]),
  //   fecha_nac: new FormControl('', Validators.required),
  //   password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]),
  //   tipo_usuario: new FormControl('', [Validators.required])
  //   });

  sedes = Sedes;
  newImage = '';
  newFile = '';
  datos: UserI ={
    image: null,
    rut: null,
    nombre: null,
    p_apellido: null,
    s_apellido: null,
    correo: null,
    fnac: null,   
    uid: null,
    password: null,
    perfil: null,
    sede: null,
  }

  //VAMOS A CREAR UNA VARIABLE PARA OBTENER LA LISTA DE USUARIOS DEL SERVICIO DE USUARIOS:
  usuarios: any[] = [];
  verificar_password: string;
  isAuthenticated = new BehaviorSubject(false);

  constructor(private fire: FirebaseService, 
    private usuarioService: UsuarioService,
    private validaciones: ValidacionesService, 
    private router: Router, 
    private storage:StorageService, 
    private auth:AuthService,
    private interaction: InteractionService,
    public fireStorageService: FirestorageService) { }

  ngOnInit() {
    
    //this.usuarios = this.usuarioService.obtenerUsuarios();
  }
  //método del formulario
  // async registrar(){
    // if (!this.validaciones.validarRut(this.usuario.controls.rut.value)) {
    //   alert('Rut incorrecto!');
    //   return;
    //   }
    // if (!this.validaciones.validarEdadMinima(17, this.usuario.controls.fecha_nac.value)) {
    //   alert('Edad mínima 17 años!');
    //   return; 
    //   }
    // if (this.usuario.controls.password.value != this.verificar_password) {
    //   alert('CONTRASEÑAS NO COINCIDEN!');
    //   return;
    // }
  //   this.usuarioService.agregarUsuario(this.usuario.value);
  //   this.fire.agregar('Usuarios',this.usuario.value);
  //   alert('USUARIO REGISTRADO!');
  //   this.router.navigate(['/login']);
  // }

  async registrar(){
    if (!this.validaciones.validarRut(this.datos.rut)) {
      this.interaction.presentToast('Rut invalido');
      return;
      }
    if (!this.validaciones.validarEdadMinima(17, this.datos.fnac)) {
      this.interaction.presentToast('Edad mínima 17 años');
      return; 
      }
    if (this.datos.password != this.verificar_password) {
      this.interaction.presentToast('Contraseñas no coinciden');
      return;
    }
    console.log('usuario',this.datos);
    this.interaction.presentLoading('Creando usuario...')
    const res = await this.auth.registrarUser(this.datos).catch(error =>{
      this.interaction.closeLoading();
      this.interaction.presentToast('Error');
      console.log('error');
    })
    if (res){
      this.interaction.presentLoading('Creando usuario...')
      console.log('exito al crear usuario');
      this.interaction.closeLoading();
      const path = 'Usuarios';
      const id = res.user.uid;
      this.datos.uid = id;
      this.datos.password = null;
      const pat='Fotos'
      const name = this.datos.uid;
      const resp = await this.fireStorageService.uploadImage(this.newFile,pat,name);
      this.datos.image = resp;
      await this.fire.createDoc(this.datos,path,id)
      this.interaction.closeLoading();
      this.interaction.presentToast('Usuario registrado con éxito!');
      this.router.navigate(['/login']);
    }
  }

  

  async newImageUpload(event: any){
    console.log(event);
    if(event.target.files && event.target.files[0]){
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) =>{
        this.newImage = image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }


}
