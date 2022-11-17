import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { tarifas } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { StorageService } from 'src/app/services/storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';



declare var google;

@Component({
  selector: 'app-geo',
  templateUrl: './geo.page.html',
  styleUrls: ['./geo.page.scss'],
})
export class GeoPage implements OnInit {

  tarifa: tarifas ={
    id:this.fireService.getId(),
    conductor:null,
    hora_salida:null,
    puestos_disp:null,
    precio:null
  }
  tarifas: tarifas[] =[];

  id_tarifa ='tarifas';

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  constructor(private activatedRoute: ActivatedRoute,
     private usuarioService: UsuarioService,
     private router: Router, 
     private storage:StorageService, 
     private fireService: FirebaseService,
     private interaction : InteractionService,
     private auth : AuthService) { }

  async ngOnInit() {
    await this.cargarMapa();
    this.autocompletado(this.map, this.marker);
    this.getResultados();
  }
  
  
  uid: string = null;
  info: tarifas = null;
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

  async registrar(){
    var respuesta: boolean = await this.storage.agregar(this.id_tarifa, this.tarifa);
    if (respuesta) {
      alert('Viaje creado con exito');
    }
  }

  async agregarViaje(){
    this.fireService.agregar('viajes',this.tarifa)
    this.interaction.presentToast('Viaje creado con éxito');
  }

  getResultados(){
    this.fireService.getCollection<tarifas>('viajes').subscribe(res =>{
      console.log('esta es la lectura',res);
      this.tarifas = res;
    });
  }

  loadViaje(){
    const path='viajes';
    this.fireService.getCollection<tarifas>(path).subscribe(res =>{
      if (res){
        this.tarifas = res;
      }
    })
  }

  async guardar(){
    await this.interaction.presentLoading('Creando...');
    console.log('guardar',this.tarifa);
    const path = 'viajes';
    await this.fireService.createDoc(this.tarifa, path,this.tarifa.id);
    this.interaction.presentToast('Viaje creado!');
    this.interaction.closeLoading();
    this.isModalOpen = false;
  }

  editar(tarifa: tarifas){
    this.isModalOpen=true;
    console.log('editar --', tarifa);
    this.tarifa = tarifa;
  }

  async eliminar(tarifa: tarifas){
    const res = await this.interaction.presentAlert('Alerta','¿Deseas cancelar el viaje?');
    console.log('res --', res);
    if(res){
      const path = 'viajes';
      await this.interaction.presentLoading('Cancelando...');
      this.fireService.deleteDoc(path,this.tarifa.id);
      this.isModalOpen=false;
      this.interaction.closeLoading();
      this.interaction.presentToast('Viaje cancelado');

    }
  }
}
