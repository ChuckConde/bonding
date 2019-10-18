import { NgModule } from "@angular/core";
import { ProposalMessages } from "./proposal-messages/proposal-messages";
import { ProposalForm } from "./proposal-form/proposal-form";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DirectivesModule } from "../../directives/directives.module";
import { ComponentsModule } from "../../components/components.module";
import { PipesModule } from "../../pipes/pipes.module";
import { IonicModule } from "ionic-angular";
import { EditProductComponent } from "./edit-product/edit-product";
import { ProposalDetailsComponent } from "./proposal-details/proposal-details";
import { ProposalCancelationComponent } from "./proposal-cancelation/proposal-cancelation";
import { ProposalAcceptationComponent } from "./proposal-acceptation/proposal-acceptation";

@NgModule({
  declarations: [
    ProposalMessages,
    ProposalForm,
    EditProductComponent,
    ProposalDetailsComponent,
    ProposalCancelationComponent,
    ProposalAcceptationComponent
  ],
  imports: [
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    ComponentsModule,
    PipesModule
  ],
  exports: [
    ProposalMessages,
    ProposalForm
  ],
  entryComponents: [
    EditProductComponent,
    ProposalDetailsComponent,
    ProposalCancelationComponent,
    ProposalAcceptationComponent
  ]
})
export class ProposalSharedModule { }
