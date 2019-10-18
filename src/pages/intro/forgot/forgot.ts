import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ViewController, LoadingController, Loading } from 'ionic-angular';
import { CustomValidators } from 'ng2-validation';
import { CommonProvider } from '../../../providers/common/common';
import { AccountApi } from '../../../sdk/index';
import { CustomErrorHandler } from '../../../providers/error/custom-error';

@Component({
  selector: 'auth-pages',
  templateUrl: 'forgot.html'
})

export class Forgot {
	public errorMsg: string = '';
  public stage: string;
  public email: string;
  public pin: string;
  public requestForm: FormGroup;
  public resetForm: FormGroup;

	private regExp: any = new RegExp('^([0-9]){0,4}$');	

	public loading: Loading;
	public resetRequest: boolean = false;
	public verifyPinRequest: boolean = false;

	constructor(
    public viewCtrl: ViewController,
    public fb: FormBuilder,
    public accountApi: AccountApi,
    public commonProvider: CommonProvider,
		public loadingCtrl: LoadingController,
		public errorHandler: CustomErrorHandler
  ) {
		const _password = new FormControl('', [Validators.required]);
		const _rpassword = new FormControl('', [Validators.required, CustomValidators.equalTo(_password)]);

		this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      passcode: [],
      password: _password,
      rpassword: _rpassword
    });
  }

	public setPin(value): void {
		this.pin = value;

		this.resetForm.controls.passcode.setValue(this.pin);
		this.validatePin();

		if (!this.resetForm.controls.passcode.touched)
			this.resetForm.controls.passcode.markAsTouched();
	}

	public validatePin(): void {
		if (this.pin && this.pin.length === 4 && this.regExp.test(this.pin))
			this.resetForm.controls.passcode.setErrors(null);
		else
			this.resetForm.controls.passcode.setErrors({
				required: true
			});
	}

  public request(): void {
		const valid = this.requestForm.valid;
		const value = this.requestForm.value;
		
		this.loading = this.loadingCtrl.create();
		this.resetRequest = true;

		if (valid) {
			this.loading.present();
			this.errorMsg = '';

			this.accountApi.resetPasswordRequest(value).subscribe(
					data => {
						this.loading.dismissAll();

						this.stage = 'reset'
					},
					err => {
						this.loading.dismissAll();
						
						this.errorMsg = this.errorHandler.getErrorMsg(err, 'reset-password-request');
					}
				);
    }
  }

  public reset(): void {
		this.loading = this.loadingCtrl.create();
		this.verifyPinRequest = true;
		
		if (!this.resetForm.controls.passcode.touched)
			this.validatePin();

		const value = this.resetForm.value;
		const valid = this.resetForm.valid;

		if (valid) {
			this.loading.present();
			this.errorMsg = '';

			this.accountApi.resetAccountPassword(value).subscribe(
				data => {
					this.loading.dismissAll();

					this.viewCtrl.dismiss()
				},
				err => {
					this.loading.dismissAll();
					
					this.errorMsg = this.errorHandler.getErrorMsg(err, 'reset-account-password');
				}
			);
    }
  }

  public login(): void {
    this.viewCtrl.dismiss('login');
  }

  public close(): void {
    this.viewCtrl.dismiss();
  }
}
