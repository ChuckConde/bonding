import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';

@Injectable()
export class ConnectivityProvider {

  public onDevice: boolean;

  constructor(public platform: Platform, public network: Network) {
    this.onDevice = this.platform.is('cordova');
  }

  public isOnline(): boolean {
    if (this.onDevice && this.network.type) {
      return this.network.type !== 'none';
    } else {
      return navigator.onLine;
    }
  }

  public isOffline(): boolean {
    if (this.onDevice && this.network.type) {
      return this.network.type === 'none';
    } else {
      return !navigator.onLine;
    }
  }

  public watchOnline(): any {
    return this.network.onConnect();
  }

  public watchOffline(): any {
    return this.network.onDisconnect();
  }

}
