import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ErrorProvider {

  constructor(
    public toastCtrl: ToastController
  ) {
  }
  public handleError(err: any): void {
    if (typeof err === 'string') {
      this.presentToast(err);
    } else if (err instanceof Response) {
      const res: Response = err;
      if (res.text() && res.text() !== res.statusText) {
        this.presentToast(res.text() + '\n' + res.statusText);
      } else {
        this.presentToast(res.statusText);
      }
    } else if (err && err.message) {
      this.presentToast(err.message);
    } else if (err) {
      this.presentToast(err.toString());
    } else {
      this.presentToast('An unknown error has occurred');
    }
  }

  public presentToast(text?: string): void {
    const toast = this.toastCtrl.create({
      message: text,
      duration: 3500
    });
    toast.present();
  }
}
