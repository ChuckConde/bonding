import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';
import { IonicModule } from 'ionic-angular/module';
import { DirectivesModule } from '../directives/directives.module';
import { PipesModule } from '../pipes/pipes.module';

import { LoadingComponent } from './loading/loading';
import { NoDataComponent } from './no-data/no-data';
import { PinVerifyComponent } from './pin-verify/pin-verify';

import { Colors } from './colors/colors';
import { ContactListComponent } from './contact-list/contact-list';
import { SimpleLineIconComponent } from './icons/simple-line-icon/simple-line-icon';
import { ImageGridComponent } from './image-grid/image-grid';
import { ImageSliderComponent } from './image-slider/image-slider';
import { PreviewComponent } from './preview/preview';
import { IonicSelectableModule, IonicSelectableComponent } from 'ionic-selectable';

@NgModule({
  declarations: [
    LoadingComponent,
    NoDataComponent,
    PinVerifyComponent,
    SimpleLineIconComponent,
    ContactListComponent,
    ImageGridComponent,
    PreviewComponent,
    ImageSliderComponent,
    Colors
  ],
  imports: [
    IonicModule,
    FormsModule,
    DirectivesModule,
    PipesModule,
    MomentModule,
    IonicSelectableModule
  ],
  exports: [
    LoadingComponent,
    NoDataComponent,
    PinVerifyComponent,
    SimpleLineIconComponent,
    ContactListComponent,
    ImageGridComponent,
    PreviewComponent,
    ImageSliderComponent,
    Colors,
    IonicSelectableComponent
  ],
  entryComponents: [
    PreviewComponent,
    Colors
  ]
})
export class ComponentsModule { }
