import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { Events, IonicPage, Loading, LoadingController, ModalController, NavController, NavParams, AlertController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { ErrorProvider } from '../../providers/error/error';
import { SocialProvider } from '../../providers/social/social';
import { Account, AccountApi, LoopBackAuth, RealTime, StorageBrowser, CityApi } from '../../sdk/index';
import { DashboardPage } from '../dashboard/dashboard';
import { Forgot } from './forgot/forgot';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Verify } from './verify/verify';
import { WalkthroughPage } from '../walkthrough/walkthrough';
import { CustomErrorHandler } from '../../providers/error/custom-error';
import { LocationApi } from '../../sdk/services/custom/Location';
import { ProfessionalPreferencesApi } from '../../sdk/services/custom/ProfessionalPreferences';
import { ZoneApi } from '../../sdk/services/custom/Zone';
import { Tos } from './tos/tos';

declare var window: any;

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage implements OnInit {

  public loading: Loading;
  public isWeb: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private events: Events,
    public socialProvider: SocialProvider,
    public accountApi: AccountApi,
    public lbAuth: LoopBackAuth,
    public rt: RealTime,
    public commonProvider: CommonProvider,
    public errorProvider: ErrorProvider,
    public loadingCtrl: LoadingController,
    public storageBrowser: StorageBrowser,
		public nativeStorage: NativeStorage,
		public cityApi: CityApi,
    public errorHandler: CustomErrorHandler,
    public locationApi: LocationApi,
    public professionalPreferencesApi: ProfessionalPreferencesApi,
    public zoneApi: ZoneApi,
    public alertCtrl: AlertController
  ) { }

  /**
   * on page init, try to auto login
   * get user id form local storage
   * @method ngOnInit
   * @return void
   */
  public ngOnInit(): void {
    if (window &&	window.location && 
        window.location.host === 'web.bondingapp.com' || window.location.host === 'localhost:8100') {
      this.isWeb = true;
    }

		this.loading = this.loadingCtrl.create();
		
		const token = this.lbAuth.getToken();
		const rememberMe = token.rememberMe;

    this.nativeStorage.getItem('$LoopBackSDK$userId').then((userId) => {
      if (userId && rememberMe) {
        this.autoLogin(userId);
      }
    }).catch(() => {
      const userId = this.storageBrowser.get('$LoopBackSDK$userId');
      if (userId && rememberMe) {
        this.autoLogin(userId);
      }
		});
  }

  /**
   * opens login modal, with data if redirected from signup model
   * ondismiss, checks the data, if data== forgot, open password-reset modal,
   * else result will be user data. if user account_verified is false, open verify modal,
   * otherwise go to feed page
   * @param data
   * @method login
   * @return void
   */
  public login(data?: any): void {
    const modal = this.modalCtrl.create(Login, { data });
    
    modal.present();
    modal.onDidDismiss((result) => {
      if (result) {
        if (result === 'forgot') {
          this.forgot();
        } else {
          this.saveToken(result);
          
          if (!result.user.account_verified) {
            this.verify(result);
          } else {
            this.autoLogin(result.userId);
          }
        }
      }
    });
  }

  /**
   * opens signup modal
   * ondismiss, if user data is passed, open login modal with user data
   * @method signup
   * @return void
   */
  public signup(event?: any): void {
		event && event.preventDefault();

		const modal = this.modalCtrl.create(Signup);
		
		modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        this.login(data);
      }
    });
  }

  /**
   * opens password reset modal
   * ondismiss, open login modal
   * @method forgot
   * @return void
   */
  public forgot(): void {
    const modal = this.modalCtrl.create(Forgot);
    modal.present();
    modal.onDidDismiss(() => {
      this.login();
    });
  }

  /**
   * opens verify modal, with data if redirected from login model (when user account is not verified)
   * ondismiss, checks the data, if data exists, save and navigate to feed page
   * @param data
   * @method verify
   * @return void
   */
  public verify(data?): void {
    const modal = this.modalCtrl.create(Verify, { data });
		modal.present();
    modal.onDidDismiss((userId) => {
      if (userId) {
        this.autoLogin(userId);
      }
    });
  }

  /**
   * users devices  native facebook app to login
   * @method fbLogin
   * @return void
   */
  public fbLogin(): void {
    this.socialProvider.fbLogin()
      .then((user: any) => {
        this.accountApi.socialLogin(user)
          .subscribe((data) =>

            this.accountApi.login({ email: user.email, password: user.id })
              .subscribe((userData) => {

                this.saveToken(userData);
                this.autoLogin(userData.userId);
              }),

          (err) => {
            this.errorProvider.handleError(err);
          });
      }, (err) => {
				this.commonProvider.presentToast('Facebook Login error: ' + err, '7500');
      });
  }

  /**
   * users devices  native google app to login
   * @method googleLogin
   * @return void
   */
  public googleLogin() {

    this.socialProvider.googleLogin()
      .then((user: any) => {

        this.accountApi.socialLogin(user)
          .subscribe((data) =>

            this.accountApi.login({ email: user.email, password: user.userId })
              .subscribe((userData) => {

                this.saveToken(userData);
                this.autoLogin(userData.userId);
              }),

          (err) => {
            this.errorProvider.handleError(err);
          });
      }, (err) => {
				this.commonProvider.presentToast('Google Login error: ' + err, '7500');
      });
  }

  /**
   * auto login will used presented id from localstorage to get user details.
   * if user details is successfully returned, the login is still valid and user can continue to the app.
   * @method autoLogin
   * @private
   * @return void
   */
  private autoLogin(id: number): void {
    const filter = {
      include: [
        {
          relation: 'contact',
          scope: {
            where: { is_deleted: false },
            include: [
              {
                relation: 'location',
                scope: {
                  where: { is_deleted: false },
                  include: ['country', 'province', 'city']
                }
              },
              {
                relation: 'professionalPreferences',
                scope: {
                  where: { is_deleted: false }
                }
              }
            ]
          }
        },
        {
          relation: 'catalogs',
          scope: {
            where: {
              is_deleted: false,
              container: `catalogs-${id}`,
              accountId: id
            }
          }
        },
        {
          relation: 'planMapping',
          scope: {
            where: { is_deleted: false },
            include: ['plan']
          }
        }
      ]
    };

    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.accountApi.findById(id, filter).subscribe(
      (accountData: Account) => { 
        this.accountApi.getRole().subscribe(
          (roleData: any) => {
            this.commonProvider.role = roleData.role;
            
            /**
						 * Add class to ion-app item
						 */
						this.addRoleClass(roleData.role.name);
            
            /**
             * Rejects admin login
             */
            if (roleData.role.name === 'admin') {
              this.accountApi.logout(() => {
                const alertCtrl = this.alertCtrl.create({
                  title: 'Login',
                  subTitle: 'Los administradores sólo pueden iniciar sesión en backoffice.',
                  buttons: ['Ok']
                });
                
                alertCtrl.present();
                this.navCtrl.setRoot(IntroPage);
                this.events.publish('userLogout');
                this.loading.dismissAll();
              });

              return;
            }

            /** 
             * Prevenir que cuentas no verificadas lleguen al dashboard 
             */
            if (!accountData.account_verified) {
              const userData = this.lbAuth.getCurrentUserData();
    
              this.verify(userData);
              return;
            }

            /** 
             * Prevenir que cuentas que no hayan aceptado los TYC puedan avanzar 
             */
            if (!accountData.isTosRead) {
              const data = { 
                saveOnClose: true,
                isAgent: roleData.role.name === 'agent'
              };
              const opts = { enableBackdropDismiss: false };
              const modal = this.modalCtrl.create(Tos, data, opts);

              this.loading.dismissAll();
              modal.present();

              modal.onDidDismiss(() => {
                const loading = this.loadingCtrl.create();
                
                loading.present();
                this.accountApi.patchAttributes(
                  accountData.id,
                  { isTosRead: true }
                ).subscribe(
                  () => {
                    accountData.isTosRead = true;
                    loading.dismissAll();

                    if (!accountData.contact.wtComplete) {
                      this.goToWalkthrough(accountData);
                    } else {
                      this.goToDashboard(accountData, roleData);
                    }
                  });
              });
              return;
            }

            this.loading.dismissAll();
            
            if (accountData.contact.wtComplete) {
              this.goToDashboard(accountData, roleData);
            } else {
              this.goToWalkthrough(accountData);
            }
          });
      },
      (error: any) => {
				this.loading.dismissAll()
				
				this.errorHandler.handleError(error);
      }
    );
  }

  private goToWalkthrough(accountData: any): void {
    this.navCtrl.setRoot(WalkthroughPage);

    this.events.subscribe('walkthroughComplete', (wtData) => {
      console.log('walkthroughComplete');

      this.loading = this.loadingCtrl.create();
      this.loading.present();

      this.accountApi.completeWtData({
        wtData: wtData
      }).subscribe(
        () => { 
          this.loading.dismissAll();
          this.autoLogin(accountData.id);
        });
    });
  }

  private goToDashboard(accountData, roleData): void {
    const filter = {
      where: {
        is_deleted: false,
        professionalPreferencesId: accountData.contact.professionalPreferences.id
      },
      include: [
        {
          relation: 'location',
          scope: {
            where: { is_deleted: false },
            include: ['country', 'province', 'city']
          }
        }
      ]
    };

    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.zoneApi.find(filter).subscribe(
      (response: any) => {
        accountData.contact.professionalPreferences.locations = response;

        this.commonProvider.contact = accountData.contact;
        this.commonProvider.role = roleData.role;
        
        if (roleData.role.name === 'company') {
          if (accountData.catalogs && accountData.catalogs.length) {
            this.commonProvider.catalog = accountData.catalogs[0];
          }
        } 
        // else {
        //   delete accountData.catalogs;
        // }

        this.loading.dismissAll();
        this.events.publish('profileChange', accountData.contact);
        this.navCtrl.setRoot(DashboardPage);
      });
  }

  private saveToken(data) {
		const rememberMe = typeof data.rememberMe !== 'undefined' ? data.rememberMe : true;

		this.nativeStorage.setItem('$LoopBackSDK$id', data.id);
    this.nativeStorage.setItem('$LoopBackSDK$userId', data.userId);
    this.nativeStorage.setItem('$LoopBackSDK$user', data.user);
    this.nativeStorage.setItem('$LoopBackSDK$created', data.created);
		this.nativeStorage.setItem('$LoopBackSDK$ttl', data.ttl);

		this.storageBrowser.set('$LoopBackSDK$id', data.id);
    this.storageBrowser.set('$LoopBackSDK$userId', data.userId);
    this.storageBrowser.set('$LoopBackSDK$user', data.user);
    this.storageBrowser.set('$LoopBackSDK$created', data.created);
		this.storageBrowser.set('$LoopBackSDK$ttl', data.ttl);
		
    this.lbAuth.setRememberMe(rememberMe);
    this.lbAuth.setToken(data);
    this.lbAuth.setUser(data);
    this.lbAuth.save();
  }
	
	private addRoleClass(roleName: string): void {
		const document = window.document || null;

		if (document) {
			const ionApp = document.getElementsByTagName('ion-app')[0];

			ionApp.classList.remove('role-company');
			ionApp.classList.remove('role-agent');
			ionApp.classList.remove('role-admin');
			ionApp.classList.add(`role-${roleName}`);
		}
	}
}
