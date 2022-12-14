import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { tarifas } from 'src/app/models/models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { InteractionService } from 'src/app/services/interaction.service';

declare var google;

@Component({
  selector: 'app-info-viaje',
  templateUrl: './info-viaje.page.html',
  styleUrls: ['./info-viaje.page.scss'],
})
export class InfoViajePage implements OnInit {

  
  latitud: number;
  longitud: number;
  map: any;
  marker: any;
  search: any;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();

  tarifa: tarifas ={
    id:this.fireService.getId(),
    conductor:null,
    hora_salida:null,
    puestos_disp:null,
    precio:null
  }

  tarifas: tarifas[] =[];

  constructor(private fireService: FirebaseService, private router: Router, private interaction: InteractionService) { }

  async ngOnInit() {
    this.getResultados();
    await this.cargarMapa();
    this.autocompletado(this.map, this.marker);
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



  
  aceptarViaje(){
    this.interaction.timedLoad('Aceptando viaje...')
    this.router.navigate(['/home/viajes']);
  }

  async cargarMapa(){

    

    //obtengo latitud y longitud del navegador:
    var geolocation = await this.obtenerUbicacion();
    this.latitud = geolocation.coords.latitude;
    this.longitud = geolocation.coords.longitude;

    //mapa: toma el elemento div llamado map desde el HTML:
    const mapa: HTMLElement = document.getElementById('map');

    this.map = new google.maps.Map(mapa, {
      center: {
        lat: this.latitud,
        lng: this.longitud
      },
      zoom: 14
    });
    this.directionsRenderer.setMap(this.map);
    const indicacionesHTML: HTMLElement = document.getElementById('indicaciones');
    this.directionsRenderer.setPanel(indicacionesHTML);

    this.marker = new google.maps.Marker({
      position: {lat: this.latitud, lng: this.longitud},
      map: this.map,
      title: 'Ubicacion inicial'
    });
  }
  calcularRuta(){
    var place = this.search.getPlace().geometry.location;
    
    var request = {
      origin: {lat: -33.598407852011846, lng: -70.57909246040431},
      destination: place,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (resultado, status) => {
      this.directionsRenderer.setDirections(resultado);
    });
    this.marker.setPosition(null);

  }

  autocompletado(mapaLocal, marcadorLocal){
    var autocomplete: HTMLElement = document.getElementById('autocomplete');
    const search = new google.maps.places.Autocomplete(autocomplete);
    search.bindTo('bounds', this.map);
    this.search = search;

    search.addListener('place_changed', function(){
      var place = search.getPlace().geometry.location;
      mapaLocal.setCenter(place);
      mapaLocal.setZoom(15);

      marcadorLocal.setPosition(place);
      marcadorLocal.setMap(mapaLocal);

    });
  }

  obtenerUbicacion(): Promise<any>{
    return new Promise(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    );
  }

  getResultados(){
    this.fireService.getCollection<tarifas>('viajes').subscribe(res =>{
      console.log('este es el viaje',res);
      this.tarifas = res;
    });
  }

  verViaje(tarifa: tarifas){
    console.log('editar --', tarifa);
    this.tarifa = tarifa;
  }
}
