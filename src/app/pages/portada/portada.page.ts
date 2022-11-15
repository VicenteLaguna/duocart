import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-portada',
  templateUrl: './portada.page.html',
  styleUrls: ['./portada.page.scss'],
})
export class PortadaPage implements OnInit {
  usuario: any;
  constructor(private activateRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(){
    //this.usuario = this.router.getCurrentNavigation().extras.state.usuario;
  }

}
