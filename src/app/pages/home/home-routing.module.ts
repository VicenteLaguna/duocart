import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'viajes',
        loadChildren: () => import('../viajes/viajes.module').then( m => m.ViajesPageModule),
      },
      {
        path: 'portada',
        loadChildren: () => import('../portada/portada.module').then( m => m.PortadaPageModule),
      },
      {
        path: 'geo',
        loadChildren: () => import('../geo/geo.module').then( m => m.GeoPageModule),
      },
      {
        path: 'perfil/:valor',
        loadChildren: () => import('../perfil/perfil.module').then( m => m.PerfilPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
