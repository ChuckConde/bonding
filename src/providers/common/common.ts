import { HttpClient } from '@angular/common/http';
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Base64 } from '@ionic-native/base64';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { ImagePicker } from '@ionic-native/image-picker';
import { ActionSheetController, AlertController, Platform, ToastController } from 'ionic-angular';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { CONFIG } from '../../app/main';
import { Contact } from '../../sdk/index';
import { ErrorProvider } from '../error/error';
import { Files } from '../../sdk/models/Files';

@Injectable()
export class CommonProvider {

  public contact: Contact;
  public catalog: Files;
  public role: any;
  public roleUiPreferences: any = {
    agent: {
      color: '#f15232',
      activeItem: '#ea3510'
    },
    company: {
      color: '#201d48',
      activeItem: '#232045'
    },
    admin: {
      color: '#000000',
      activeItem: '#2d2d2d'
    }
  };

  private renderer: Renderer2;

  constructor(
    public http: HttpClient,
    public platform: Platform,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    public base64: Base64,
    public imagePicker: ImagePicker,
    public geolocation: Geolocation,
    public errorProvider: ErrorProvider,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public isDevice(device: string): void {
    this.platform.is(device);
  }

  public presentToast(message?: string, duration?: string) {
    let durationTime = 0;

    if (duration === 'long') {
      durationTime = 5000;
    } else if (duration === 'short') {
      durationTime = 2500;
    } else {
      durationTime = 3500;
    }
    const toast = this.toastCtrl.create({
      message,
      duration: durationTime
    });
    toast.present();
  }

  public showAlert(title: string, subTitle: string, buttons?: string) {
    buttons = !buttons ? 'OK' : null;
    const alert = this.alertCtrl.create({
      title,
      subTitle,
      buttons: [buttons]
    });
    alert.present();
  }

  public imageUpload(source: number): Promise<any> {
    // Cordova
    if (this.platform.is('cordova')) {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: source
      };
      return new Promise<any>((resolve, reject) => {
        this.camera.getPicture(options).then((imageData) => {
          resolve('data:image/jpeg;base64,' + imageData);
        }, (err) => {
          reject(err);
        });
      });
    }
    // Browser
    else {
      return new Promise<any>((resolve, reject) => {
        const input = this.renderer.createElement('input');
      
        this.renderer.setAttribute(input, 'accept', 'image/*');
        this.renderer.setAttribute(input, 'name', 'file');
        this.renderer.setAttribute(input, 'type', 'file');
        this.renderer.setStyle(input, 'display', 'none');

        input.click();
        this.renderer.listen(input, 'change', (event) => {
          const file = event.target.files && event.target.files[0];

          if (file && file.size > 1048576) {
            reject();
          }

          if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              resolve(reader.result);
            };
          }
        });
      });
    }
  }

  public getPictures(max): Promise<any> {
    const options = {
      outputType: 1,
      quality: 100,
      maximumImagesCount: max
    };
    return this.imagePicker.getPictures(options).then((results) => {
    
      return results.map((item) => 'data:image/jpeg;base64,' + item);
    }, (err) => { this.errorProvider.handleError(err); });
  }

  public b64toBlob(b64Data: any, contentType?: any) {
    const sliceSize = 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    if (!contentType) {
      contentType = '';
    }

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
    
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  public getGeoLocation() {
    return this.geolocation.getCurrentPosition().then((resp) => {
      return [resp.coords.latitude, resp.coords.longitude].join();
    }).catch((error) => {
      this.errorProvider.handleError(error);
    });
  }

  public getLocation(coords): Observable<any> {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
    return this.http.get(`${url}${coords}&key=${CONFIG.GOOGLE_API_KEY}`)
      .map((res) => res)
      .catch((error) => Observable.throw(error || 'Server error'));
  }

  public byString(o, s): string {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    const a = s.split('.');
    for (let i = 0, n = a.length; i < n; ++i) {
      const k = a[i];
      if (o && k in o) {
        o = o[k];
      } else {
        return;
      }
    }
    return o;
  }

  public randomDate() {
    const start = new Date(moment().startOf('month').toISOString());
    const end = new Date(moment().endOf('month').toISOString());
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  public randomOlderDate() {
    const start = new Date(moment().subtract(1, 'month').startOf('month').toISOString());
    const end = new Date(moment().subtract(1, 'month').endOf('month').toISOString());
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
}
