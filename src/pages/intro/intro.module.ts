import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';
import { IntroPage } from './intro';

import { Forgot } from './forgot/forgot';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Tos } from './tos/tos';
import { Verify } from './verify/verify';

@NgModule({
  declarations: [
    IntroPage,
    Login,
    Signup,
    Forgot,
    Verify,
    Tos
  ],
  imports: [
    IonicPageModule.forChild(IntroPage),
    DirectivesModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    Login,
    Signup,
    Forgot,
    Verify,
    Tos
  ]
})
export class IntroPageModule { }
