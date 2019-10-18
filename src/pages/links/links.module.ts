import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LinksPage } from './links';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
		LinksPage
  ],
  imports: [
		IonicPageModule.forChild(LinksPage),
		ComponentsModule,		
    DirectivesModule		
  ],
})
export class LinksPageModule {}
