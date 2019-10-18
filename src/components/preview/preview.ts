import { Component } from '@angular/core';
import { ActionSheetController, NavController, NavParams, ViewController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { Platform } from 'ionic-angular/platform/platform';
import { Contact } from '../../sdk';

@Component({
  selector: 'preview',
  templateUrl: 'preview.html'
})
export class PreviewComponent {
  public isAgent: boolean = true;
	public role: any;
	public me: Contact;
  public images: any;
  public multiple: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public actionSheetCtrl: ActionSheetController,
    public commonProvider: CommonProvider,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.me = this.commonProvider.contact;
		this.role = this.commonProvider.role;
    this.isAgent = this.role.name === 'agent';
    
    this.images = this.navParams.get('data');
    this.images = this.images ? this.images : [];
    this.multiple = this.navParams.get('multiple');
  }

  public upload(): void {
    if (this.multiple) {
      this.commonProvider.getPictures(5)
        .then((results: string[]) => {
          results.forEach((image) => {
            // this.commonProvider.toBase64(image)
            //   .then((base64: string) => {
                console.log('hi', JSON.stringify(image));
                this.images.push(image);
              //   this.commonProvider.presentToast(JSON.stringify(this.images[0]));
              // }).catch((error) => console.log(error));
          });
          this.validate(this.images);
        }).catch((error) => console.log(error));
    } else {
      const mobileButtons = [
        {
          text: 'Camara',
          handler: () => {
            this.commonProvider.imageUpload(1)
              .then((results: string) => {
                this.images = results;
              }).catch((error) => console.log(error));
          }
        },
        {
          text: 'Biblioteca',
          handler: () => {
            this.commonProvider.imageUpload(0)
              .then((results: string) => {
                this.images = results;
              }).catch((error) => console.log(error));
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ];
      const browserButtons = [
        { 
          text: 'Biblioteca',
          handler: () => {
            this.commonProvider.imageUpload(0)
              .then((results: string) => {
                this.images = results;
              }).catch((error) => console.log(error));
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => { }
        }
      ];
      const actionSheet = this.actionSheetCtrl.create({
        title: '',
        buttons: this.platform.is('cordova') ? mobileButtons : browserButtons
      });
      
      actionSheet.present();
    }
  }

  public validate(images: any[]): void {
    if (images.length > 5) {
      images.slice(0, 5);
      this.commonProvider.showAlert('Warning', 'Se permiten como máximo 5 imágenes');
    }
  }
}
