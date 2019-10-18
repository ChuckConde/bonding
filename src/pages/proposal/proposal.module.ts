import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProposalPage } from './proposal';
import { ProposalSharedModule } from '../proposal.shared/proposal.shared.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    ProposalPage
  ],
  imports: [
    IonicPageModule.forChild(ProposalPage),
    ProposalSharedModule,
    DirectivesModule
  ],
})
export class ProposalPageModule {}
