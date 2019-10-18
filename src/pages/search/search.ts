import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, ModalController, Loading, LoadingController, AlertController, Events } from 'ionic-angular';
import { ChangeParamsComponent } from './change-params/change-params';
import { CommonProvider } from '../../providers/common/common';
import { Contact, AccountApi, FriendApi, ContactApi } from '../../sdk';
import { ProfilePage } from '../profile/profile';
import { PurchaseVolume } from '../../mockups/purchase-volume';



@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
	public linksLimit : boolean = false;
	public contacts: object = [];
	public loading: Loading;
  public loadingFlag: boolean = true;

	public role: any;
	public me: Contact;
	public isAgent: boolean = true;
	
	public chips: Array<string> = [];
	
	private filters;
	private purchaseVolume: any = PurchaseVolume;

  constructor(
		public navCtrl: NavController,
		public navParams: NavParams, 
		public modalCtrl: ModalController,
		private commonProvider: CommonProvider,
		public loadingCtrl: LoadingController,
    public accountApi: AccountApi,
    private contactApi: ContactApi,
		private alertCtrl: AlertController,
    public friendApi: FriendApi,
    private events: Events
	) {}

	ngOnInit() {
		this.me = this.commonProvider.contact;
		this.role = this.commonProvider.role;
    this.isAgent = this.role.name === 'agent';

		this.searchContacts();
	}

	private searchContacts(filter?: any): void {
		let data = {};

		if (filter) {
			this.filters = filter;
			this.chips = this.getChips(filter);
			
			data = {
        limit: 100,
        skip: 0,
        segments: filter.segment,
        ageFrom: filter.ageFrom,
        ageTo: filter.ageTo,
        city: filter.city,
        experience: filter.experience,
        keyword: filter.keyword,
        province: filter.province,
        purchaseVolume: filter.purchaseVolume,
        othernames: filter.othernames,
        description: filter.description
			};
		} else {
			this.chips = [];
	
			data = {
        limit: 100,
        skip: 0
			};
		}

		this.loading = this.loadingCtrl.create();
		this.loading.present();
    this.loadingFlag = true;

		this.contactApi.search(data).subscribe(
			(response) => {
				this.contacts = response.response;
        this.loading.dismissAll();
        this.loadingFlag = false;
			});
	}
	
  public changeParams(): void {
		const modal = this.modalCtrl.create(ChangeParamsComponent, {
			prevFilters: this.filters
		});
		modal.present();
		modal.onDidDismiss(data => {
			if (data) {
				this.searchContacts(data);
			}
		});
	}

	public getContactAge(dateOfBirth): string {
		let retval = '';

		dateOfBirth = new Date(dateOfBirth);
		let ageDifMs = Date.now() - dateOfBirth.getTime();
		var ageDate = new Date(ageDifMs);
		retval = `${Math.abs(ageDate.getUTCFullYear() - 1970)} años`;

		return retval;
	}

	public goToProfile(contact): void {
    this.navCtrl.push(ProfilePage, {
			data: contact
    });

    this.events.unsubscribe('profileLeave');
    this.events.subscribe('profileLeave', (data: any) => {
      
      if (!data) {
        contact.status = null;
      } else {
        if (data.friendship.accept) {
          contact.status = 'ACCEPTED';
        }
      }
      
      this.events.unsubscribe('profileLeave');
    })
	}

	public sendLinkInvitation(contact): void {
    const linkedId = contact.id;

    this.loading = this.loadingCtrl.create();
    this.loading.present();
    
    this.friendApi.createLink(linkedId).subscribe(
      response => {
        console.log(response)
        let alert = this.alertCtrl.create({
          title: 'Vincular',
          subTitle: 'La solicitud de vinculación fue enviada con éxito.',
          buttons: ['Continuar']
        });

        contact.status = 'PENDING';

				this.loading.dismissAll();
        alert.present();
      },
      error => {
        let alert = this.alertCtrl.create({
          title: 'Vincular',
          subTitle: error.message,
          buttons: ['Continuar']
        });
            
        this.loading.dismissAll();
        alert.present();

        if (error.code === 'LINK_PENDING') {
          contact.status = 'PENDING';
        }

        if (error.code === 'LINKS_LIMIT') {
          this.linksLimit = true;
        }
      }
    );
	}

	private getChips(filter: any): Array<string> {
		const retval = [];

		// Name (for companies)
		if (filter.keyword) {
			retval.push(`<b>Nombre:</b> ${filter.keyword}`);
		}

		// Name (for agents)
		if (filter.othernames) {
			retval.push(`<b>Nombre:</b> ${filter.othernames}`);
		}

		// Description (for companies)
		if (filter.description) {
			retval.push(`<b>Descripción:</b> ${filter.description}`);
		}

		// Segments
		if (filter.segment && filter.segment.length) {
			retval.push(`<b>Rubros:</b> ${filter.segment.join(', ')}`);
		}

		// Location
		if (filter.city || filter.province) {
			if (filter.city) {
				retval.push(`<b>Ubicación:</b> ${filter.province.label}, ${filter.city.label}`);
			} else {
				retval.push(`<b>Ubicación:</b> ${filter.province.label}, Cualquier ciudad`);
			}
		}

		// Purchase volume
		if (filter.purchaseVolume && filter.purchaseVolume.length) {
			const text = filter.purchaseVolume.map((key) => {
				return this.purchaseVolume[key].label;
			});
			retval.push(`<b>Volumen de ventas:</b> ${text.join(', ')}`)
		}
		
		// Experience
		if (filter.experience && filter.experience.length && filter.experience.length === 1) {
			const text = filter.experience[0] === 'true'? 'Con experiencia' : 'Sin experiencia';
			retval.push(`<b>Experiencia:</b> ${text}`); 
		}

		// Age range
		if (filter.ageFrom || filter.ageTo) {
			if (filter.ageFrom && filter.ageTo) {
				retval.push(`<b>Edad:</b> de ${filter.ageFrom} años a ${filter.ageTo} años`);
			} else if (filter.ageFrom && !filter.ageTo) {
				retval.push(`<b>Edad:</b> desde ${filter.ageFrom} años`);
			} else if (!filter.ageFrom && filter.ageTo) {
				retval.push(`<b>Edad:</b> hasta ${filter.ageTo} años`);
			}
		}
		
		return retval;
	}
}
