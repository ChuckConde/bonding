import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
// import { Response } from '@angular/http';

@Injectable()
export class CustomErrorHandler {
	constructor(
		public toastCtrl: ToastController
	) {}

	public getErrorMsg(err: any, method?: string): string {
		const code: any = err.code || '';
		const statusCode: any = err.statusCode || '';
		const details: any = err.details;

		let errMsg = '';

		switch(true) {
			case code === 'LOGIN_FAILED' && statusCode === 401:
				errMsg = 'Usuario y/o contraseña incorrectos.';
				break;

			case statusCode === 500 && method === 'reset-password-request':
				errMsg = 'El email ingresado no pertenece a ninguna cuenta registrada.';
				break;

			case statusCode === 500 && method === 'reset-account-password':
				errMsg = 'El código de verificación ingresado no es válido.';
				break;

			case statusCode === 500 && method === 'verify-email':
				errMsg = 'El código de verificación ingresado no es válido.';
				break;

			case statusCode === 422 && details && details.context === 'Account' && details.codes && typeof details.codes.email !== 'undefined':
				errMsg = 'El email ingresado ya está en uso, por favor, intenta con otro.';
				break;

			case statusCode === 422 && code === 'PSWD_INVALID':
				errMsg = 'La contraseña elegida no es válida.';
				break; 

			default: 
				errMsg = 'Ocurrió un error, por favor, intenta nuevamente';
				break;
		}

		/** 
		 * net::ERR_INTERNET_DISCONNECTED -> No hay conexión a internet
		 * net::ERR_CONNECTION_REFUSED -> El servidor no responde 
		 * net::ERR_NAME_NOT_RESOLVED -> Host inválido
		 * 
		 * Ante cualquiera de estos errores la respuesta del skd es 'Server error'
		 */
		if (!code && !statusCode && err === 'Server error') {
			const msg = 'Ocurrió un error al intentar conectar con el servidor. Comprueba tu conexión a internet e intenta nuevamente.';

			errMsg = '';
			this.presentToast(msg);
		}
		
		console.log('code', code);
		console.log('statusCode', statusCode);
		console.log('err', err);
		console.log('errMsg', errMsg);
		console.log('methd', method);

		return errMsg;
	}
	
	public handleError(err: any, method?: string): void {
		const code: any = err.code || '';
		const statusCode: any = err.statusCode || '';
		const details: any = err.details;

		let errMsg = '';
		
		switch(true) {
			case code === 'AUTHORIZATION_REQUIRED' && statusCode === 401:
				errMsg = 'Tu sesión expiró.';
				break;
		}

		if (!code && !statusCode && err === 'Server error') 
			errMsg = 'Ocurrió un error al intentar conectar con el servidor. Comprueba tu conexión a internet e intenta nuevamente.';
		
			if (errMsg) this.presentToast(errMsg);
	}

	public presentToast(msg?: string): void {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 4500
    });
	 
		toast.present();
  }
}
