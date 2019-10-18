import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';

import { DashboardPage } from './dashboard';
import { UploadCatalogPage } from '../upload-catalog/upload-catalog';

@NgModule({
  declarations: [
    DashboardPage
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),
    ComponentsModule,
    DirectivesModule
  ],
  entryComponents: [
    UploadCatalogPage
  ]
})
export class DashboardPageModule {}
