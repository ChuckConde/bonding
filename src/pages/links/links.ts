import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { Contact, FriendApi, Friend } from '../../sdk';
import { CommonProvider } from '../../providers/common/common';
import { ProfilePage } from '../profile/profile';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';

@IonicPage()
@Component({
  selector: 'page-links',
  templateUrl: 'links.html',
})
export class LinksPage implements OnInit {
	public activeTab: string; // ACTIVE, PENDING, DELETED
	public role: any;
	public me: Contact;
	public isAgent: boolean = true;
	public loading: Loading;
  public loadingFlag: boolean = true;

  public links: any = [];

  constructor(
		public navCtrl: NavController, 
		public commonProvider: CommonProvider,
		public friendApi: FriendApi,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		public actionSheetCtrl: ActionSheetController
	) { }

  ngOnInit() {
		this.me = this.commonProvider.contact;
		this.role = this.commonProvider.role;
		this.isAgent = this.role.name === 'agent';
		
		this.setActiveTab('ACTIVE');
	}
	
	public setActiveTab(tab): void {
		this.activeTab = tab;

    switch(true) {
      case this.activeTab === 'ACTIVE':
        this.getActiveLinks();
        break;
  
      case this.activeTab === 'PENDING':
        this.getPendingLinks();
        break;
      
      case this.activeTab === 'DELETED':
        this.getDeletedLinks();
        break;
    }
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

	public getPendingLinks(): void {
		this.loading = this.loadingCtrl.create();
		this.loading.present();
    this.loadingFlag = true;

		this.friendApi.getPendingLinks().subscribe(
			(response: any) => {
        this.links = response;
        this.loading.dismissAll();
        this.loadingFlag = false;
			});
	}
	
	public getDeletedLinks(): void {
		this.loading = this.loadingCtrl.create();
		this.loading.present();
    this.loadingFlag = true;

    this.friendApi.getDeletedLinks().subscribe(
			(response: any) => {
				this.links = response;
        this.loading.dismissAll();
        this.loadingFlag = false;
			});
	}

	public openOptions(type: string, link: any): void {
		let actionSheetOpt = {};

    if (type === 'PENDING') {
      if (link.sended) {
        type = 'PENDING_SEND';
      } else {
        type = 'PENDING_RECIVED';
      }
    }

		switch(type) {
      case 'ACTIVE':
				actionSheetOpt = {
					buttons: [
						{
							text: 'Ver perfil',
							handler: () => {
								this.goToProfile(link.linked.contact);
							}
						},
						{
							text: 'Eliminar vinculación',
							handler: () => {
								this.deleteLink(link);
							}
						},
						{
							text: 'Cerrar menu',
							role: 'cancel',
							handler: () => {}
						}
					]
				};
				break;

			case 'PENDING_SEND':
				actionSheetOpt = {
					buttons: [
						{
							text: 'Ver perfil',
							handler: () => {
								this.goToProfile(link.linked.contact);
							}
						},
						{
							text: 'Cancelar solicitud de vinculación',
							handler: () => {
								this.cancelLink(link);
							}
						},
						{
							text: 'Cerrar menu',
							role: 'cancel',
							handler: () => {}
						}
					]
				};
				break;
			
			case 'PENDING_RECIVED':
				actionSheetOpt = {
					buttons: [
						{
							text: 'Ver perfil',
							handler: () => {
								this.goToProfile(link.linked.contact);
							}
						},
						{
							text: 'Aceptar solicitud de vinculación',
							handler: () => {
								this.confirmLink(link);
							}
						},
						{
							text: 'Rechazar solicitud de vinculación',
							handler: () => {
								this.rejectLink(link);
							}
						},
						{
							text: 'Cerrar menu',
							role: 'cancel',
							handler: () => {}
						}
					]
				};
				break;
			
			case 'DELETED':
				actionSheetOpt = {
					buttons: [
						{
							text: 'Ver perfil',
							handler: () => {
								this.goToProfile(link.linked.contact);
							}
						},
						{
							text: 'Cerrar menu',
							role: 'cancel',
							handler: () => {}
						}
					]
				};
				break;
		
			default:
				break;
		}

		const actionSheet = this.actionSheetCtrl.create(actionSheetOpt);
		actionSheet.present();
	}

	public goToProfile(contact: Contact): void {
		this.navCtrl.push(ProfilePage, {data: contact});
	}

	public cancelLink(link: Friend): void {
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
						this.loading = this.loadingCtrl.create();
						this.loading.present();

            this.friendApi.cancelLink(link.id).subscribe(
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
                this.loading.dismissAll();
                this.setActiveTab('PENDING');
              })
					}
				}
			]
		});

		alert.present();
	}

	public rejectLink(link: Friend): void {
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
						this.loading = this.loadingCtrl.create();
            this.loading.present();
            
            this.friendApi.rejectLink(link.id).subscribe(
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
                this.loading.dismissAll();
                this.setActiveTab('PENDING');
              });
					}
				}
			]
		});

		alert.present();
	}

	public confirmLink(link: Friend): void {
    this.loading = this.loadingCtrl.create();
		this.loading.present();

    this.friendApi.confirmLink(link.id).subscribe(
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
        this.loading.dismissAll();
        this.setActiveTab('ACTIVE');
      });
	}

	public deleteLink(link: Friend): void {
		const alert = this.alertCtrl.create({
			title: 'Vinculaciones activas',
			subTitle: '¿Estás seguro que deseas eliminar tu vinculación?',
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
						this.loading = this.loadingCtrl.create();
						this.loading.present();

            this.friendApi.deleteLink(link.id).subscribe(
              () => {
                const alert = this.alertCtrl.create({
									title: 'Vinculaciones activas',
									subTitle: 'La vinculación fue eliminada.',
									buttons: [
										{
											text: 'Continuar',
											handler: () => {}
										}
									]
								});

								alert.present();
								this.loading.dismissAll();
								this.setActiveTab('ACTIVE');
              });
					}
				}
			]
		});

		alert.present();
	}
}
