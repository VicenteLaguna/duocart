import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { ValidacionesService } from 'src/app/services/validaciones.service';

@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.page.html',
  styleUrls: ['./administrar.page.scss'],
})
export class AdministrarPage implements OnInit {

  //variable grupo:
  usuario = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9kK]')]),
    nom_completo: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@(duocuc|duoc|profesor.duoc).(cl)')]),
    fecha_nac: new FormControl('', Validators.required),
    semestre: new FormControl('', [Validators.required, Validators.min(1), Validators.max(8)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]),
    tipo_usuario: new FormControl('', [Validators.required])
  });
  usuarios: any[] = [];

  constructor( private alertController: AlertController, private storage:StorageService, private validaciones: ValidacionesService) { }

  async ngOnInit() {
    await this.listar();
  }

  //metodos para trabajar el storage:
  async listar(){
    this.usuarios = await this.storage.getDatos('usuarios');
  }

  async agregar(){
            //validación de salida para buscar un rut válido.
            if (!this.validaciones.validarRut(this.usuario.controls.rut.value)) {
              alert('Rut incorrecto!');
              return;
            }
            //validación de salida para verificar que persona tenga al menos 17 años.
            if (!this.validaciones.validarEdadMinima(17, this.usuario.controls.fecha_nac.value)) {
              alert('Edad mínima 17 años!');
              return; 
            }
    let resp = await this.storage.agregar('usuarios',this.usuario.value);
    if(resp){
      alert('Usuario agregado');
      this.usuario.reset();
      await this.listar();
    }else{
      alert('No se pudo agregar usuario');
    }
  }

  async buscar(rut){
    let usuarioEncontrado = await this.storage.getDato('usuarios',rut);
    this.usuario.setValue(usuarioEncontrado);
  }

  async modificar(){
    await this.storage.actualizar('usuarios', this.usuario.value);
    await this.listar();
  }

  async eliminar(rut){
    const alert = await this.alertController.create({
      header: '¿Seguro que desea eliminar al usuario de rut ' + rut + '?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('NO ELIMINA!');
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
           this.storage.eliminar('usuarios',rut);  
           this.listar(); 
           this.usuario.reset();    
          },
        },
      ],
    });
    await alert.present();
  }

  

}