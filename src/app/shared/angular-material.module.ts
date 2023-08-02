import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import {MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [],
  providers:[],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatDialogModule
  ],
  exports: [
    MatPaginatorModule,MatDialogModule
  ]
})
export class AngularMaterialModule { }
