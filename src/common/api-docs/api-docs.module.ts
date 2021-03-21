import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiDocsComponent } from './api-docs.component';
import { ApiDocsRoutingModule } from './api-docs-routing.module';
import { MaterialNavbarModule } from '../core/ui/material-navbar/material-navbar.module';

@NgModule({
  declarations: [ApiDocsComponent],
  imports: [
    CommonModule,
    ApiDocsRoutingModule,
    MaterialNavbarModule,
  ]
})
export class ApiDocsModule { }
