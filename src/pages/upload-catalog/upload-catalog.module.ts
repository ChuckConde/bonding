import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UploadCatalogPage } from './upload-catalog';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    UploadCatalogPage
  ],
  imports: [
    IonicPageModule.forChild(UploadCatalogPage),
    ComponentsModule
  ],
})
export class UploadCatalogPageModule {}
