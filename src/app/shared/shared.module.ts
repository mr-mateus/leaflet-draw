import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ThfModule } from '@totvs/thf-ui';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ThfModule,
    LeafletModule,
    LeafletDrawModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ThfModule,
    LeafletModule,
    LeafletDrawModule
  ]
})
export class SharedModule { }
