import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, Events, LoadingController, Loading, AlertController, Platform, ViewController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { ErrorProvider } from '../../providers/error/error';
import { AccountApi, Contact, ConversationApi, FriendApi, ZoneApi } from '../../sdk/index';
import { HttpClient } from '@angular/common/http';
import { YearsOfExperience } from '../../mockups/years-of-experience';
import { PurchaseVolume } from '../../mockups/purchase-volume';
import { Genders } from '../../mockups/genders';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { UploadCatalogPage } from '../upload-catalog/upload-catalog';
import { CONFIG } from '../../app/main';
import { FileTransferObject, FileTransfer, FileTransferError } from '@ionic-native/file-transfer';
import { ProposalPage } from '../proposal/proposal';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit {
	public raiting: number;
	public loading: Loading;

  public yearsOfExperience: any = YearsOfExperience;
  public purchaseVolume: any = PurchaseVolume;
	
	public me: Contact;
	public role: any;
	public isAgent: boolean = true;
  public contact: Contact;
  public friendship: any;
  public showCloseButton: boolean = false;

  private fileTransfer: FileTransferObject;

  @ViewChild('downloadButton')
  private downloadButton: ElementRef;

  constructor(
		public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
		public modalCtrl: ModalController,
		public commonProvider: CommonProvider,
		public errorProvider: ErrorProvider,
		public conversationApi: ConversationApi,
		public friendApi: FriendApi,
		public accountApi: AccountApi,
		public events: Events,
		public http: HttpClient,
		public loadingCtrl: LoadingController,
    public zoneApi: ZoneApi,
    private transfer: FileTransfer,
    private platform: Platform,
    public viewCtrl: ViewController
	) {}

  ngOnInit() {
    this.me = this.commonProvider.contact;
    this.role = this.commonProvider.role; 
    
    if (this.navParams.get('origin')) {
      const origin = this.navParams.get('origin');

      this.showCloseButton = origin === 'modal';
    }
    
    if (!this.navParams.get('data')) {
			this.contact = this.me;
			this.isAgent = this.role.name === 'agent';
		} else {
      let asyncCount = 0;
      const data = this.navParams.get('data');
			const filter = {
				where: {
					is_deleted: false,
					professionalPreferencesId: data.professionalPreferences.id
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

			this.accountApi.getRoleById(data.accountId).subscribe(
				(role: any) => {
          this.isAgent = role.role.name === 'agent';
          
          asyncCount++;
          if (asyncCount === 3) {
            this.loading.dismissAll();
          }
        });
      
      this.zoneApi.find(filter).subscribe(
        (response: any) => {
          this.contact = data;
          this.contact.professionalPreferences.locations = response;

          asyncCount++;
          if (asyncCount === 3) {
            this.loading.dismissAll();
          }
        });

      this.friendApi.getFriendship(data.accountId).subscribe(
        (response: any) => {
          this.friendship = response;
          
          if (this.friendship && this.friendship.catalog) {
            this.friendship.catalog.downloadUrl = `${CONFIG.BASE_URL}/${CONFIG.API_VERSION}/Containers/${this.friendship.catalog.container}/download/${this.friendship.catalog.name}`;
            this.friendship.catalog.downloadName = this.friendship.catalog.originalName;
          }

          asyncCount++;
          if (asyncCount === 3) {
            this.loading.dismissAll();
          }
        });
		}
	}
  
  ionViewDidLeave() {
    this.events.publish('profileLeave', this.friendship);
  }

  public close(): void {
    this.viewCtrl.dismiss();
  }

  public editProfile(): void {
    const modal = this.modalCtrl.create(EditProfilePage);
    modal.present();
  }

  public sendLink(): void {
    const linkedId = this.contact.accountId;
    const loading = this.loadingCtrl.create();
    
    loading.present();
    
    this.friendApi.createLink(linkedId).subscribe(
      response => {
        let alert = this.alertCtrl.create({
          title: 'Vincular',
          subTitle: 'La solicitud de vinculación fue enviada con éxito.',
          buttons: ['Ok']
        });

        alert.present();
        this.updateFriendship(loading);
      },
      error => {
        let alert = this.alertCtrl.create({
          title: 'Vincular',
          subTitle: error.message,
          buttons: ['Ok']
        });
            
        this.loading.dismissAll();
        alert.present();
      }
    );
  }

  public rejectLink(): void {
    const linkId = this.friendship.friendship.id;
    const alert = this.alertCtrl.create({
			title: 'Vinculaciones pendientes',
			subTitle: '¿Estás seguro que deseas rechazar la solicitud de vinculación?',
			buttons: [
				{
					text: 'Cancelar',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => {}
				},
				{
					text: 'Confirmar',
					handler: () => {
						const loading = this.loadingCtrl.create();
            
            loading.present();
            
            this.friendApi.rejectLink(linkId).subscribe(
              () => {
                const alert = this.alertCtrl.create({
                  title: 'Vinculaciones pendientes',
                  subTitle: 'La solicitud fue rechazada.',
                  buttons: [{
                    text: 'Continuar',
                    handler: () => {}
                  }]
                });

                alert.present();
                this.updateFriendship(loading);
              });
					}
				}
			]
		});

		alert.present();
  }
  
  public cancelLink(): void {
    const linkId = this.friendship.friendship.id;
		const alert = this.alertCtrl.create({
			title: 'Vinculaciones pendientes',
			subTitle: '¿Estás seguro que deseas cancelar la solicitud de vinculación?',
			buttons: [
				{
					text: 'Cancelar',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => {}
				},
				{
					text: 'Confirmar',
					handler: () => {
						const loading = this.loadingCtrl.create();
            
            loading.present();

            this.friendApi.cancelLink(linkId).subscribe(
              () => {
                const alert = this.alertCtrl.create({
                  title: 'Vinculaciones pendientes',
                  subTitle: 'La solicitud fue cancelada.',
                  buttons: [{
                    text: 'Continuar',
                    handler: () => {}
                  }]
                });

                alert.present();
                this.updateFriendship(loading);
              })
					}
				}
			]
		});

		alert.present();
	}

	public confirmLink(): void {
    const linkId = this.friendship.friendship.id;
    const loading = this.loadingCtrl.create();
    
    loading.present();

    this.friendApi.confirmLink(linkId).subscribe(
      () => {
        const alert = this.alertCtrl.create({
          title: 'Vinculaciones pendientes',
          subTitle: 'La solicitud fue aceptada.',
          buttons: [{
            text: 'Continuar',
            handler: () => {}
          }]
        });

        alert.present();
        this.updateFriendship(loading);
      });
	}

  public uploadCatalog(): void {
    const modal = this.modalCtrl.create(UploadCatalogPage, null, {
      cssClass: 'file-upload-modal'
    });
    modal.present();
  }

  public downloadCatalog(): void {
    const url = encodeURI(this.friendship.catalog.downloadUrl);
    // Cordova
    if (this.platform.is('cordova')) {
      let storageDirectory;
      
      if (this.platform.is('ios')) {
        storageDirectory = cordova.file.documentsDirectory;
      } else if (this.platform.is('android')) {
        storageDirectory = cordova.file.dataDirectory;
        /**
         * If errors, try
         * storageDirectory = cordova.file.externalDataDirectory;
         * https://stackoverflow.com/questions/46585458/ionic-file-download-not-working
         */
      } else {
        // Let's supouse it's `ionic cordova run browser`
        storageDirectory = cordova.file.dataDirectory;
      }
      
      this.fileTransfer = this.transfer.create();
      this.fileTransfer.download(
        url, 
        `${storageDirectory}${this.friendship.catalog.originalName}`,
        true
      ).then(
        (entry: any) => {
          console.log('download completed: ', entry.toURL());  
        },
        (error: FileTransferError) => {
          console.log('error', error);
          this.commonProvider.presentToast(`Ocurrio un error. (Code: ${error.code})`);
        });
    } 
    // Browser
    else {
      this.downloadButton.nativeElement.click();
    }
  }

  public initProposal(): void {
    this.navCtrl.push(ProposalPage, {
      company: this.contact
    });
  }

  private updateFriendship(loading: Loading): void {
    this.friendApi.getFriendship(this.contact.accountId).subscribe(
      (response: any) => {
        this.friendship = response;

        if (this.friendship && this.friendship.catalog) {
          this.friendship.catalog.downloadUrl = `${CONFIG.BASE_URL}/${CONFIG.API_VERSION}/Containers/${this.friendship.catalog.container}/download/${this.friendship.catalog.name}`;
          this.friendship.catalog.downloadName = this.friendship.catalog.originalName;
        }

        loading.dismissAll();
      });
  }

  /** @TODO: convertir todos estos metodos gets en pipes */
	public getContactAge(dateOfBirth): string {
		let retval = '';

		dateOfBirth = new Date(dateOfBirth);
		let ageDifMs = Date.now() - dateOfBirth.getTime();
		var ageDate = new Date(ageDifMs);
		retval = `${Math.abs(ageDate.getUTCFullYear() - 1970)} años`;

		return retval;
	}

	public getContactGender(gender): string {
		let retval = Genders.filter((item) => {
			if (item.value === gender) return item;
		});

		return retval[0].label;
	}

	public getVolumes(volumes): any {
		let retval = [];

		volumes.split(',').forEach((volume) => {
			PurchaseVolume.forEach((item) => {
				if (item.value == volume) retval.push(item);
			});
		});

		return retval;
	}

	public getYearsOfExperience(range): string {
		let retval = YearsOfExperience.filter((item) => {
			if (item.value == range) return item;			
		});
		
		return retval[0].label;
  }
}
