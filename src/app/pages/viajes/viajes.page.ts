import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { tarifas } from 'src/app/models/models';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {

  tarifa: tarifas ={
    id:this.fireService.getId(),
    conductor:null,
    hora_salida:null,
    puestos_disp:null,
    precio:null
  }

  tarifas: tarifas[] =[];

  //tarifa: any[]=[];

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  constructor(private fireService: FirebaseService, private router: Router) { }

  ngOnInit() {
    this.getResultados();
  }

  // listar(){
  //   this.fireService.getDatos('viajes').subscribe(
  //     (data:any) => {
  //       this.tarifa = [];
  //       for(let v of data){
  //         let tarifaJson = v.payload.doc.data();
  //         tarifaJson['id'] = v.payload.doc.id;
  //         this.tarifa.push(tarifaJson);
  //         //console.log(v.payload.doc.data());
  //       }
  //     }
  //   );
  // }

  verViaje(tarifa: tarifas){
    this.isModalOpen=true;
    console.log('editar --', tarifa);
    this.tarifa = tarifa;
  }

  getResultados(){
    this.fireService.getCollection<tarifas>('viajes').subscribe(res =>{
      console.log('esta es la lectura',res);
      this.tarifas = res;
    });
  }
  

}
