import { Component } from "@angular/core";
import { ViewController, LoadingController, Loading } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { CustomValidators } from "ng2-validation";
import { AccountApi, Contact } from "../../../sdk";
import { CommonProvider } from "../../../providers/common/common";

@Component({
  selector: 'change-password',
  templateUrl: 'change-password.html'
})
export class ChangePassword {
  public isAgent: boolean = true;
	public role: any;
  public me: Contact;
  
  public form: FormGroup;
  public userData: any;
  public saveRequest: boolean = false;
  public formError: string = '';
  private loading: Loading;

  constructor(
    private viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private accountApi: AccountApi,
    private commonProvider: CommonProvider
  ) {	}

  public ngOnInit(): void {
    this.me = this.commonProvider.contact;
		this.role = this.commonProvider.role;
    this.isAgent = this.role.name === 'agent';
    
    const _password = new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()_@%&\-]).*$/)]);
    const _rpassword = new FormControl('', [Validators.required, CustomValidators.equalTo(_password)]);

    this.form = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      password: _password,
      rpassword: _rpassword
    });
  }

  public close() {
    this.viewCtrl.dismiss();
  }
	
  public save(): void {
    this.saveRequest = true;
	
    if (this.form.valid) {
      this.loading = this.loadingCtrl.create();
      this.loading.present();
			
      this.accountApi.changePassword(
        this.form.value.oldPassword,
        this.form.value.password
      ).subscribe(
        (response: any) => {
          this.commonProvider.presentToast('Tu contraseña fue actualizada');
          this.loading.dismiss();
          
          this.close();
        },
        err => {
          this.loading.dismiss();

          if (
            (err.statusCode === 401 && err.code === 'LOGIN_FAILED_PWD') ||
            (err.statusCode === 400 && err.code === 'INVALID_PASSWORD')
          ) {
            this.formError = 'La contraseña ingresada no es correcta';
            return;
          }

          if (err.statusCode === 401 && err.code === 'LOGIN_FAILED_EMAIL') {
            this.formError = 'El email ingresado no es correcto.';
            return;
          }

          this.formError = 'Ocurrió un error al intentar guardar tu contraseña. Por favor, intenta nuevamente';
        }
      )
    }
  }
}
