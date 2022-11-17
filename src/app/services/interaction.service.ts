import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  loading : any;

  constructor(public toastController: ToastController,
              public loadingController: LoadingController,
              public alertController: AlertController) { }

  async presentToast(mensaje: string){
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  async presentLoading(mensaje: string){
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: mensaje,
    });
    await this.loading.present();
  }

  async closeLoading(){
    await this.loading.dismiss();
  }

  async timedLoad(mensaje: string){
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: mensaje,
      duration: 1000
    });
    await this.loading.present();
  }

  async themedToast() {
    const toast = await this.toastController.create({
      message: 'Hello Styled World!',
      duration: 3000,
      cssClass: 'custom-toast',
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel'
        }
      ],
    });
}
async presentToastTop(mensaje: string,position: 'top') {
  const toast = await this.toastController.create({
    message: mensaje,
    duration: 1500,
    position: position
  });

  await toast.present();
}

async presentAlert(texto: string, subtitulo : string){

  let aceptar = false;

  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: texto,
    subHeader: subtitulo,
    buttons: [{
      text: 'Si',
      handler: () => {
        aceptar = true;
      }
    },{
      text:'No',
      role: 'cancel',
      cssClass: 'secondary',
    }
  ]
  });
  await alert.present();
  await alert.onDidDismiss();
  return aceptar
}



}


