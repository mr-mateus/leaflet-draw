import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { LeafletDrawDirective } from '@asymmetrik/ngx-leaflet-draw';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    CoreModule

  ]
})
export class HomeModule { }
