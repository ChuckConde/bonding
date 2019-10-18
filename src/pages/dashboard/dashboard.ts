import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, ModalController, Events } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { Contact } from '../../sdk';
import { SearchPage } from '../search/search';
import { LinksPage } from '../links/links';
import { ProposalsPage } from '../proposals/proposals';
import { UploadCatalogPage } from '../upload-catalog/upload-catalog';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage implements OnInit {
  public me: Contact;
 	public role: any;
	public isAgent: boolean = true;
  public recommendedActions: any[] = [];

	constructor(
		private commonProvider: CommonProvider,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private events: Events
	) {}

	ngOnInit() {
    this.me = this.commonProvider.contact;
		this.role = this.commonProvider.role;
    this.isAgent = this.role.name === 'agent';
    
    if (!this.isAgent && !this.commonProvider.catalog) {
      this.recommendedActions.push('catalog');
    }
	}

	public navigate(target: string): void {
    switch(target) {
      case 'search':
        this.navCtrl.setRoot(SearchPage);
        this.events.publish('resetSidemenuStatus', 'SearchPage');
        break;
      
      case 'proposals':
        this.navCtrl.setRoot(ProposalsPage);
        this.events.publish('resetSidemenuStatus', 'ProposalsPage');
        break;
      
      case 'links':
        this.navCtrl.setRoot(LinksPage);
        this.events.publish('resetSidemenuStatus', 'LinksPage');
        break;
    }
	}
  
  public uploadCatalog(): void {
    const modal = this.modalCtrl.create(UploadCatalogPage, null, {
      cssClass: 'file-upload-modal'
    });
    modal.present();
  }
}
