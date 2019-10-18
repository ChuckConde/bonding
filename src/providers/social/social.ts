import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { NativeStorage } from '@ionic-native/native-storage';
import 'rxjs/add/operator/toPromise';
import { CONFIG } from '../../app/main';
import { Account, AccountApi } from '../../sdk/index';

@Injectable()

/**
 * provider handles social authentication for facebook and google.
 * social authentication in this app is done using a devices native social applications.
 * tutorials can be found here =>
 * for google => https://ionicthemes.com/tutorials/about/ionic2-google-login
 * for facebook => https://ionicthemes.com/tutorials/about/ionic2-facebook-login
 *
 * when social login for facebook or google successfully resolves, account.sociallogin endpoint is called on the server side.
 * this checks if the user has an account, if not creates one
 * @class SocialProvider
 */
export class SocialProvider {

  constructor(
    public http: HttpClient,
    public nativeStorage: NativeStorage,
    public fb: Facebook,
    public googlePlus: GooglePlus,
    public accountApi: AccountApi
  ) {
    this.fb.browserInit(+CONFIG.FACEBOOK_KEY, 'v2.11');
  }

  /**
   * ["public_profile"] is the array of permissions, you can add more if you need
   * Getting user properties such as name and gender etc
   * @method fbLogin
   * @return Promise<any>
   */
  public fbLogin(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.fb.login(['public_profile']).then((response) => {
        this.fb.api('/me?fields=id,name,first_name,last_name,gender,email,picture{url}', ['email'])
          .then((user) => {
            user.facebook = true;
            resolve(user);
          });
      }, (err) => {
        reject(err);
      });
    });
  }

  /**
   * optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
   * optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
   * @method googleLogin
   * @return Promise<any>
   */
  public googleLogin() {
    return new Promise<any>((resolve, reject) => {
      this.googlePlus.login({
        scopes: '',
        webClientId: CONFIG.GOOGLE_CLIENT_ID,
        offline: true
      }).then((user) => {
        user.google = true;
        resolve(user);
      }, (error) => {
        reject(error);
      });
    });
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
