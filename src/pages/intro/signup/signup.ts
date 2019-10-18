import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ViewController, LoadingController, Loading } from 'ionic-angular';
import { CustomValidators } from 'ng2-validation';
import { AccountApi } from '../../../sdk/index';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';

import { Tos } from '../tos/tos';
import { CustomErrorHandler } from '../../../providers/error/custom-error';

@Component({
  selector: 'auth-pages',
  templateUrl: 'signup.html'
})
export class Signup {

	public form: FormGroup;
	public loading: Loading;
	public signupRequest: boolean = false;
	public errorMsg: string = '';

  constructor(
    public viewCtrl: ViewController,
    public fb: FormBuilder,
    private accountApi: AccountApi,
		private modalCtrl: ModalController,
		public loadingCtrl: LoadingController,
		public errorHandler: CustomErrorHandler		
  ) {
    const _password = new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()_@%&\-]).*$/)]);
    const _rpassword = new FormControl('', [Validators.required, CustomValidators.equalTo(_password)]);

    this.form = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/)]],
      password: _password,
      rpassword: _rpassword,
      isTosRead: [false, Validators.requiredTrue]
    });
  }

  public signup(): void {
		const value:ISignUp = this.form.value;
		const valid = this.form.valid;

		this.loading = this.loadingCtrl.create();
		this.signupRequest = true;

		if (valid) {
			this.loading.present();
			this.errorMsg = '';

			delete value.rpassword;
			
			this.accountApi.create(value).subscribe(
				data => {
					this.loading.dismissAll();
				
					this.viewCtrl.dismiss(value)
				},
        err => {
					this.loading.dismissAll();
					
					this.errorMsg = this.errorHandler.getErrorMsg(err);
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

  public showTos(): void {
    const modal = this.modalCtrl.create(Tos, { 
      isAgent: true 
    });

    modal.present();
  }
}

interface ISignUp {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  rpassword: string;
  isTosRead: boolean;
}
