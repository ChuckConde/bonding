import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Events, Nav, Platform } from 'ionic-angular';

import { CommonProvider } from '../providers/common/common';
import { Contact, LoopBackConfig } from '../sdk/index';
import { CONFIG } from './main';

import { DashboardPage } from '../pages/dashboard/dashboard';
import { IntroPage } from '../pages/intro/intro';
import { LinksPage } from '../pages/links/links';
import { SearchPage } from '../pages/search/search';
import { SettingPage } from '../pages/setting/setting';
import { ProposalsPage } from '../pages/proposals/proposals';

@Component({
  templateUrl: 'app.html'
})
/**
 * bootstrapped app.
 * main app start with side menu page configuration and root page
 * @class My App
 * @implements OnInit
 */
export class MyApp implements OnInit {
  @ViewChild(Nav)
  public nav: Nav;

  public me: Contact;
  public role: any;
  public color: string;
  public activeItemColor: string;
  public rootPage: any;
  public activePage: any;
  public pages: IPagesArray[];
  public settingsPage: IPagesArray;

  constructor(
    private events: Events,
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private commonProvider: CommonProvider,
    private renderer: Renderer2
  ) {
    this.rootPage = IntroPage;
    this.pages = [];
    this.settingsPage = {
      title: 'Ajustes',
      component: SettingPage,
      icon: 'settings-outline',
      image: false,
      show: false,
      name: 'SettingPage'
    };
  }

  /**
   * on platform ready, set the status bar and splashscreen
   * configure loopback connection to server side code
   * see https://github.com/mean-expert-official/loopback-sdk-builder/wiki/4.-First-Steps
   *
   * subscribe to an event that will update contact picture in menu after login.
   */
  public ngOnInit(): void {
    this.platform.ready().then(
      () => this.splashScreen.hide()
    );

    this.setActivePage('IntroPage');

    LoopBackConfig.setBaseURL(CONFIG.BASE_URL);
    LoopBackConfig.setApiVersion(CONFIG.API_VERSION);

    this.events.subscribe('profileChange', (contact) => {
      console.log('profileChange')
      /** set default active page - logged in */
      const uiPreferences = this.commonProvider.roleUiPreferences;
      const rolePreferences = uiPreferences[this.commonProvider.role.name];

      this.color = rolePreferences.color;
      this.activeItemColor = rolePreferences.activeItem;

      if (!this.platform.is('cordova')) {
        const themeColorElement = this.renderer.selectRootElement('[name="theme-color"]');
        this.renderer.setAttribute(themeColorElement, 'content', this.color);
      } else if (this.platform.is('android')) {
        this.statusBar.backgroundColorByHexString(this.color);
      } else {
        this.statusBar.styleDefault();
      }

      /**
       * Acá podemos setear items del menu p/rol
       * u otras condicioens del usuario
       */
      this.setActivePage('DashboardPage');
      this.me = this.commonProvider.contact;
      this.role = this.commonProvider.role;

      if (this.role.name !== 'company') {
        this.pages = [
          {
            title: 'Inicio',
            component: DashboardPage,
            icon: 'ios-home',
            image: false,
            show: false,
            name: 'DashboardPage'
          },
          {
            title: 'Busqueda',
            component: SearchPage,
            icon: 'ios-search-outline',
            image: false,
            show: false,
            name: 'SearchPage'
          },
          {
            title: 'Vinculaciones',
            component: LinksPage,
            icon: 'ios-contacts-outline',
            image: false,
            show: false,
            name: 'LinksPage'
          },
          {
            title: 'Propuestas',
            component: ProposalsPage,
            icon: 'ios-paper-outline',
            image: false,
            show: false,
            name: 'ProposalsPage'
          }
        ];
      } else {
        this.pages = [
          {
            title: 'Inicio',
            component: DashboardPage,
            icon: 'ios-home',
            image: false,
            show: false,
            name: 'DashboardPage'
          },
          {
            title: 'Busqueda',
            component: SearchPage,
            icon: 'ios-search-outline',
            image: false,
            show: false,
            name: 'SearchPage'
          },
          {
            title: 'Vinculaciones',
            component: LinksPage,
            icon: 'ios-contacts-outline',
            image: false,
            show: false,
            name: 'LinksPage'
          },
          {
            title: 'Propuestas',
            component: ProposalsPage,
            icon: 'ios-paper-outline',
            image: false,
            show: false,
            name: 'ProposalsPage'
          }
        ];
      }
    });

    this.events.subscribe('userLogout', () => {
      console.log('userLogout')

      this.events.unsubscribe('walkthroughComplete');

      this.setActivePage('IntroPage');
      this.removeRoleClass();
    });

    this.events.subscribe('resetSidemenuStatus', (activePage?) => {
      console.log('resetSidemenuStatus')

      if (!activePage) {
        activePage = '';
      }

      this.setActivePage(activePage);
    });
  }

  public openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.setActivePage(page.name);
    this.nav.setRoot(page.component);
  }

  private removeRoleClass(): void {
    const document = window.document || null;

    if (document) {
     const ionApp = document.getElementsByTagName('ion-app')[0];

     ionApp.classList.remove('role-company');
     ionApp.classList.remove('role-agent');
     ionApp.classList.remove('role-admin');
    }
  }

  private setActivePage(pageName: string): void {
    this.activePage = pageName;
  }
}

export interface IPagesArray {
  title: string;
  component: any;
  icon: string;
  image: boolean;
  show: boolean;
  name: string;
}
