import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';


declare var google;

@Component({
  selector: 'app-geo',
  templateUrl: './geo.page.html',
  styleUrls: ['./geo.page.scss'],
})
export class GeoPage implements OnInit {

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  usuario: any;
  cantidad : number;

  constructor(private activatedRoute: ActivatedRoute, private usuarioService: UsuarioService,private router: Router) { }

  async ngOnInit() {
    await this.cargarMapa();
    this.autocompletado(this.map, this.marker);
  }
  
  //VARIABLES PARA EL MAPA:
  latitud: number;
  longitud: number;
  //VARIABLE MAP: variable a través de la cual se carga el mapa de google.
  map: any;
  marker: any;
  search: any;
  //NECESITAMOS 2 VARIABLES GLOBALES PARA CALCULAR Y MOSTRAR RUTA EN EL MAPA:
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
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

  obtenerUbicacion(): Promise<any>{
    return new Promise(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    );
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
}

