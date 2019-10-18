import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProposalsPage } from './proposals';
import { ComponentsModule } from '../../components/components.module';
import { ProposalContacts } from './proposal-contacts/proposal-contacts';
import { ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';
import { DirectivesModule } from '../../directives/directives.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
		ProposalsPage,
		ProposalContacts
  ],
  imports: [
		IonicPageModule.forChild(ProposalsPage),
		ComponentsModule,
    ReactiveFormsModule,
    MomentModule,
    DirectivesModule,
    PipesModule,
	],
  entryComponents: [
		ProposalContacts,
    ProposalsPage
	]	
})
export class ProposalsPageModule {}
