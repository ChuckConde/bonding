import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';
import { PipesModule } from '../../pipes/pipes.module';
import { ChangePassword } from './change-password/change-password';
import { SettingPage } from './setting';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { Tos } from '../intro/tos/tos';
import { UploadCatalogPage } from '../upload-catalog/upload-catalog';

@NgModule({
  declarations: [
    SettingPage,
    ChangePassword
  ],
  imports: [
    IonicPageModule.forChild(SettingPage),
    ComponentsModule,
    DirectivesModule,
    PipesModule
  ],
  entryComponents: [
    ChangePassword,
    EditProfilePage,
    UploadCatalogPage,
    Tos
  ]
})
export class SettingPageModule {}
