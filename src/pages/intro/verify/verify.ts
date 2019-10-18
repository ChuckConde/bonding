import { Component } from '@angular/core';
import { NavParams, ViewController, LoadingController, Loading } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common/common';
import { ErrorProvider } from '../../../providers/error/error';
import { AccountApi } from '../../../sdk';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomErrorHandler } from '../../../providers/error/custom-error';

@Component({
  selector: 'auth-pages',
  templateUrl: 'verify.html'
})
export class Verify {
	// public errorMsg: string = "El código de verificacion ingresado no es válido. Comprueba el correo que recibiste y vuelve a intentarlo.";
	public errorMsg: string = '';
	public pin: string;
	private regExp: any = new RegExp('^([0-9]){0,4}$');	
  public credentials: IVerify;

	public loading: Loading;
	public form: FormGroup;
	public verifyRequest: boolean = false;

  constructor(
    private navParam: NavParams,
    private viewCtrl: ViewController,
    private accountApi: AccountApi,
    public commonProvider: CommonProvider,
		public errorProvider: ErrorProvider,
		public loadingCtrl: LoadingController,
		public fb: FormBuilder,
		public errorHandler: CustomErrorHandler
  ) {
    this.credentials = this.navParam.get('data').user;

		this.form = this.fb.group({
			passcode: []
		});
	}

	public setPin(value): void {
		this.pin = value;

		this.form.controls.passcode.setValue(this.pin);
		this.validatePin();

		if (!this.form.controls.passcode.touched)
			this.form.controls.passcode.markAsTouched();
	}

	public validatePin(): void {
		if (this.pin && this.pin.length === 4 && this.regExp.test(this.pin))
			this.form.controls.passcode.setErrors(null);
		else
			this.form.controls.passcode.setErrors({
				required: true
			});
	}

  public verify(): void {
		this.loading = this.loadingCtrl.create();
		this.verifyRequest = true;

		if (!this.form.controls.passcode.touched)
			this.validatePin();

		const value = this.form.value.passcode;
		const valid = this.form.valid;
		
		if (valid) {
			this.loading.present();
			this.errorMsg = '';

			this.credentials.passcode = value;

			this.accountApi.verifyEmail(this.credentials).subscribe(
				data => {
					this.loading.dismissAll();
					
					this.viewCtrl.dismiss(this.navParam.get('data').userId);
				},
				err => {
					this.loading.dismissAll();
					
					this.errorMsg = this.errorHandler.getErrorMsg(err, 'verify-email');
				}
			);
		}
  }

  public resendVerification() {
		
    if (this.credentials.email) {

			this.loading = this.loadingCtrl.create();
			this.loading.present();

      this.accountApi.resendVerification(this.credentials).subscribe(
        (data) => {
					this.loading.dismissAll();

					this.errorMsg = '';
					this.pin = '';
					this.commonProvider.presentToast('El email de verificación se reenvió con éxito')
				},
        (err) => {
					this.loading.dismissAll();
					
					this.errorMsg = this.errorHandler.getErrorMsg(err, 'resend-verification');
				}
			);
    } else {
      this.commonProvider.presentToast('Ocurrió un error, por favor, intentalo de nuevo.');
    }
  }

  public close(): void {
    this.viewCtrl.dismiss();
  }
}

interface IVerify {
  email: string;
  passcode: string;
  password: string;
}
