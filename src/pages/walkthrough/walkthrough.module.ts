import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';
import { WalkthroughPage } from './walkthrough';

@NgModule({
  declarations: [
    WalkthroughPage,
  ],
  imports: [
    IonicPageModule.forChild(WalkthroughPage),
    ComponentsModule,
    DirectivesModule,
  ],
})
export class WalkthroughPageModule {}
