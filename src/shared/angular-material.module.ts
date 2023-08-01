import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import {MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [],
  providers:[],
  imports: [
    CommonModule,
    MatPaginatorModule
  ],
  exports: [
    MatPaginatorModule
  ]
})
export class AngularMaterialModule { }
