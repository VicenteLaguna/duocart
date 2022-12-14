import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoViajePageRoutingModule } from './info-viaje-routing.module';

import { InfoViajePage } from './info-viaje.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoViajePageRoutingModule
  ],
  declarations: [InfoViajePage]
})
export class InfoViajePageModule {}
