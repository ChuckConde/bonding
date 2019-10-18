// IONIC + ANGULAR
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MbscModule } from '@mobiscroll/angular';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

// CORE
import { ComponentsModule } from '../components/components.module';
import { DirectivesModule } from '../directives/directives.module';
import { PipesModule } from '../pipes/pipes.module';
import { SDKBrowserModule, StorageBrowser } from '../sdk';
import { MyApp } from './app.component';

// 3RD PARTY COMPONENTS
import { IonicSelectableModule } from 'ionic-selectable';

// CORDOVA
import { Base64 } from '@ionic-native/base64';
import { CallNumber } from '@ionic-native/call-number';
import { Camera } from '@ionic-native/camera';
import { Facebook } from '@ionic-native/facebook';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { Geolocation } from '@ionic-native/geolocation';
import { GooglePlus } from '@ionic-native/google-plus';
import { ImagePicker } from '@ionic-native/image-picker';
import { Keyboard } from '@ionic-native/keyboard';
import { NativeStorage } from '@ionic-native/native-storage';
import { Network } from '@ionic-native/network';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

// PAGE MODULES
import { DashboardPageModule } from '../pages/dashboard/dashboard.module';
import { EditProfilePageModule } from '../pages/edit-profile/edit-profile.module';
import { IntroPageModule } from '../pages/intro/intro.module';
import { LinksPageModule } from '../pages/links/links.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { ProposalsPageModule } from '../pages/proposals/proposals.module';
import { SearchPageModule } from '../pages/search/search.module';
import { SettingPageModule } from '../pages/setting/setting.module';
import { WalkthroughPageModule } from '../pages/walkthrough/walkthrough.module';

// PROVIDERS
import { CommonProvider } from '../providers/common/common';
import { ConnectivityProvider } from '../providers/connectivity/connectivity';
import { CustomErrorHandler } from '../providers/error/custom-error';
import { ErrorProvider } from '../providers/error/error';
import { SocialProvider } from '../providers/social/social';
import { FileInterceptor } from './file.interceptor';
import { FilesApi } from '../providers/files';
import { UploadCatalogPageModule } from '../pages/upload-catalog/upload-catalog.module';
import { ProposalPageModule } from '../pages/proposal/proposal.module';

/**
 * Configuration settings for the entire app.
 * The Config lets you configure your entire app or specific platforms.
 * You can set the tab placement, icon mode, animations, and more here.
 * thisused as a parameter in IonicModule.forRoot(MyApp, APPCONFIG) in app.module.ts
 * https://ionicframework.com/docs/api/config/Config/
 *
 * @constant APPCONFIG
 */
export const APPCONFIG = {
  iconMode: 'ios',
  mode: 'md',
  menuType: 'reveal',
  tabsHideOnSubPages: true,
  tabsPlacement: 'top',
  dayShortNames: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
  monthShortNames: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
};

/**
 * bootstrap angular app
 * import modules and providers.
 */
@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    FormsModule,
    MbscModule,
    SDKBrowserModule.forRoot(),
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, APPCONFIG),
    DirectivesModule,
    ComponentsModule,
    PipesModule,
    IntroPageModule,
    ProfilePageModule,
    SettingPageModule,
    DashboardPageModule,
    WalkthroughPageModule,
    IonicSelectableModule,
    SearchPageModule,
    EditProfilePageModule,
    LinksPageModule,
    ProposalsPageModule,
    ProposalPageModule,
    UploadCatalogPageModule
  ],
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
    MyApp
  ],
  providers: [
    Base64,
    StorageBrowser,
    StatusBar,
    SplashScreen,
    Keyboard,
    Geolocation,
    CallNumber,
    Camera,
    ImagePicker,
    SocialSharing,
    Facebook,
    Network,
    GooglePlus,
    NativeStorage,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    CommonProvider,
    ErrorProvider,
    FilesApi,
    CustomErrorHandler,
    SocialProvider,
    ConnectivityProvider,
    FileTransferObject,
    FileTransfer,
    File,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FileInterceptor,
      multi: true
    }
  ]
})
export class AppModule {}
