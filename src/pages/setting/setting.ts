import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, Events } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { AccountApi, Contact, Files } from '../../sdk/index';
import { IntroPage } from '../intro/intro';
import { ChangePassword } from './change-password/change-password';
import { ProfilePage } from '../profile/profile';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { Tos } from '../intro/tos/tos';
import { UploadCatalogPage } from '../upload-catalog/upload-catalog';

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
	public isAgent: boolean = true;
	public role: any;
	public me: Contact;
  public catalog: Files;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public accountApi: AccountApi,
    public commonProvider: CommonProvider,
    public events: Events
	) { }

  ngOnInit() {
		this.me = this.commonProvider.contact;
		this.role = this.commonProvider.role;
    this.isAgent = this.role.name === 'agent';
    
    if (!this.isAgent) {
      this.catalog = this.commonProvider.catalog;
    }
  }

  public gotoProfile(): void {
    this.navCtrl.setRoot(ProfilePage);
    this.events.publish('resetSidemenuStatus');
  }

  public editProfile(): void {
    const modal = this.modalCtrl.create(EditProfilePage);
    modal.present();
  }

  public changePassword(): void {
    const modal = this.modalCtrl.create(ChangePassword);
    modal.present();
  }

  public openTos(): void {
    const modal = this.modalCtrl.create(Tos);
    modal.present();
  }

  public uploadCatalog(): void {
    const modal = this.modalCtrl.create(UploadCatalogPage, null, {
      cssClass: 'file-upload-modal'
    });
    modal.present();
  }

  public openPlan(): void {
    console.log('openPlan');
    // modal.present();
  }
  
  public logout() {
    this.accountApi.logout(() => {
        this.navCtrl.setRoot(IntroPage);
        this.events.publish('userLogout');
    });
  }
}
