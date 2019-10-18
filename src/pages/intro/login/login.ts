import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewController, LoadingController, Loading } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { AccountApi } from '../../../sdk/index';
import { CustomErrorHandler } from '../../../providers/error/custom-error';

@Component({
  selector: 'auth-pages',
  templateUrl: 'login.html'
})
export class Login {
  public errorMsg: string = '';
  public form: FormGroup;
	public loading: Loading;
	public loginRequest: boolean = false;

  constructor(
    public navParam: NavParams,
    public viewCtrl: ViewController,
    public fb: FormBuilder,
		public accountApi: AccountApi,
		public loadingCtrl: LoadingController,
		public errorHandler: CustomErrorHandler
  ) {
    this.form = this.fb.group({
      email: ['', Validators.required],
			password: ['', Validators.required],
			rememberMe: [true]
    });
		
		const data = this.navParam.get('data');
		
		if (data) {
      this.form.patchValue(data);
    }
  }

	public login(): void {
		const valid = this.form.valid;
		const value = this.form.value;

		this.loading = this.loadingCtrl.create();
    this.loginRequest = true;

		if (valid) {
      this.loading.present();
			this.errorMsg = '';

			this.accountApi.login(value).subscribe(
				data => {
					this.loading.dismissAll();

					data.rememberMe = this.form.controls.rememberMe.value;					
					this.viewCtrl.dismiss(data);
				},
				err => {
					this.loading.dismissAll();

					this.errorMsg = this.errorHandler.getErrorMsg(err);
				}
	  	);
    } 
  }

  public signup(): void {
    this.viewCtrl.dismiss('signup');
  }

  public forgot(): void {
    this.viewCtrl.dismiss('forgot');
  }

  public close(): void {
    this.viewCtrl.dismiss();
  }
}
