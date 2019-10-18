import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ChangeParamsComponent } from './change-params/change-params';
import { SearchPage } from './search';

import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    SearchPage,
    ChangeParamsComponent
  ],
  imports: [
    IonicPageModule.forChild(SearchPage),
    ComponentsModule,
    DirectivesModule
  ],
  entryComponents: [
    ChangeParamsComponent
  ]
})
export class SearchPageModule {}
