import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {

  tarifa: any[]=[];

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  constructor(private fireService: FirebaseService, private router: Router) { }

  ngOnInit() {
    this.listar();
  }

  listar(){
    this.fireService.getDatos('viajes').subscribe(
      (data:any) => {
        this.tarifa = [];
        for(let v of data){
          let tarifaJson = v.payload.doc.data();
          tarifaJson['id'] = v.payload.doc.id;
          this.tarifa.push(tarifaJson);
          //console.log(v.payload.doc.data());
        }
      }
    );
  }
  

}
