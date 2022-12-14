import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-portada',
  templateUrl: './portada.page.html',
  styleUrls: ['./portada.page.scss'],
})
export class PortadaPage implements OnInit {
  usuario: any;

  cantidad_personajes: number =0;
  digimon : any[] = [];

  constructor(private activateRoute: ActivatedRoute, private router: Router, private apiService: ApiService) {}

  async ngOnInit(){
    let res = await this.apiService.get();
    console.log('respuesta',res);
    res.subscribe( (data:any) =>{
      console.log(data);
      this.digimon = data;
    });
    
  }

}
