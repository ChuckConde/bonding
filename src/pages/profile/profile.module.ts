import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';
import { PipesModule } from '../../pipes/pipes.module';
// import { Ionic2RatingModule } from "ionic2-rating";
import { ProfilePage } from './profile';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { UploadCatalogPage } from '../upload-catalog/upload-catalog';

@NgModule({
  declarations: [
    ProfilePage
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    ComponentsModule,
    DirectivesModule,
    PipesModule
    // Ionic2RatingModule
  ],
  entryComponents: [
    EditProfilePage,
    UploadCatalogPage
  ]
})
export class ProfilePageModule {}
