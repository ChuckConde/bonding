import { Component } from '@angular/core';
import { LoadingController, Loading, ModalController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { CommonProvider } from '../../../providers/common/common';
import { FriendApi, Contact } from '../../../sdk';
import { ProfilePage } from '../../profile/profile';

@Component({
  selector: 'proposal-contacts',
  templateUrl: 'proposal-contacts.html'
})
export class ProposalContacts {
  public me: Contact;
	public isAgent: boolean = true;
  public loading: Loading;
  public loadingFlag: boolean = true;
  public links: any = []; 

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public viewCtrl: ViewController,
    public commonProvider: CommonProvider,
		public loadingCtrl: LoadingController,
    public friendApi: FriendApi,
    public modalCtrl: ModalController
  ) { }

  public ngOnInit(): void {
    this.me = this.commonProvider.contact;
		this.isAgent = this.commonProvider.role.name === 'agent';

		this.getActiveLinks();
	}
	
	public getActiveLinks(): void {
		this.loading = this.loadingCtrl.create();
		this.loading.present();
    this.loadingFlag = true;

		this.friendApi.getActiveLinks().subscribe(
			(response: any) => {
        this.links = response;

        this.loading.dismissAll();
        this.loadingFlag = false;
			});
	}

  public openOptions(link: any): void {
    const actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: 'Iniciar propuesta',
          handler: () => {
            this.viewCtrl.dismiss(link.linked);
          }
        },
        {
          text: 'Ver perfil',
          handler: () => {
            const modal = this.modalCtrl.create(ProfilePage, {
              data: link.linked.contact,
              origin: 'modal'
            });
            modal.present();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });

    actionSheet.present();
  }

  public close(): void {
    this.viewCtrl.dismiss();
  }
}
