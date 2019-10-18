import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, Events,ViewController, LoadingController, Loading, AlertController, ActionSheet, ModalController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { PurchaseVolume } from '../../mockups/purchase-volume';
import { Contact, ContactApi, CountryApi, Province, City, LocationApi, ProvinceApi, ProfessionalPreferencesApi } from "../../sdk";
import { IonicSelectableComponent } from 'ionic-selectable';
import { Segments } from '../../mockups/segments';
import { YearsOfExperience } from '../../mockups/years-of-experience';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { PreviewComponent } from '../../components/preview/preview';
import { FilesApi } from '../../providers/files';


@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
	public isAgent: boolean = true;
	public role: any;
	public me: Contact;
  public form: FormGroup;
  public saveRequest: boolean = false;
  public maxDate: string;
  
  public segments: any = Segments;
  public provinces: Array<{value: Province, label: string}> = [];
  public cities: Array<{value: City, label: string}> = [];
  
  public purchaseVolume: any = PurchaseVolume;
  public yearsOfExperience: any = YearsOfExperience;
  
  private loading: Loading;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
		public events: Events,
		public commonProvider: CommonProvider,
		public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public contactApi: ContactApi,
    public countryApi: CountryApi,
    public locationApi: LocationApi,
    public provinceApi: ProvinceApi,
    public professionalPreferencesApi: ProfessionalPreferencesApi,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform,
    private modalCtrl: ModalController,
    private filesApi: FilesApi
	) { }

  ngOnInit() {
    const loading: Loading = this.loadingCtrl.create();
    loading.present();

		this.me = this.commonProvider.contact;
		this.role = this.commonProvider.role;
		this.isAgent = this.role.name === 'agent';
    this.maxDate = this.getMaxDate();

    this.form = this.formBuilder.group({
      picture: [''],
      dateOfBirth: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/)]],
      email: [{value: '', disabled: true}],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
      province: ['', Validators.required],
      city: ['', Validators.required],
      experience: [''],
      segment: ['', [Validators.required, Validators.maxLength(8)]],
      purchaseVolume: [''],
      yearsOfExperience: [''],
      companyOfWork: [''],
      ownMobility: [''],
      ownMobilityDescription: ['', Validators.maxLength(200)]
    });

    if (this.isAgent) {
      this.form.addControl(
        'firstname',
        new FormControl('', Validators.required)
      );
      this.form.addControl(
        'lastname',
        new FormControl('', Validators.required)
      );
    } else {
      this.form.addControl(
        'othernames',
        new FormControl('', Validators.required)
      );
      this.form.addControl(
        'description',
        new FormControl('', [Validators.required, Validators.minLength(30), Validators.maxLength(200)])
      );
      this.form.addControl(
        'comission',
        new FormControl('', [Validators.required, Validators.min(1), Validators.max(100)])
      );
      this.form.addControl(
        'comissionDescription',
        new FormControl('', [Validators.maxLength(200)])
      );
    }

    this.patchFormValues();
    this.getProvinces(loading);

    this.form.controls.experience.valueChanges.subscribe(
      (value: any) => {
        if (this.isAgent) {
          if (typeof value === 'string') {
            if (value === 'true') {
              this.form.controls.experience.setValue(true);
            } else {            
              this.form.controls.experience.setValue(false);
            }
  
            return;
          }
  
          if (value) {
            this.form.controls.purchaseVolume.setValue('');
            this.form.controls.purchaseVolume.setValidators([Validators.required]);
            this.form.controls.purchaseVolume.updateValueAndValidity();
            this.form.controls.yearsOfExperience.setValidators([Validators.required]);
            this.form.controls.yearsOfExperience.updateValueAndValidity();
          } else {
            this.form.controls.companyOfWork.setValue('');
            this.form.controls.purchaseVolume.setValue([]);
            this.form.controls.purchaseVolume.setValidators(null);
            this.form.controls.purchaseVolume.updateValueAndValidity();
            this.form.controls.yearsOfExperience.setValue('');
            this.form.controls.yearsOfExperience.setValidators(null);
            this.form.controls.yearsOfExperience.updateValueAndValidity();
          }
        }
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

      this.me.updated_at = new Date();
      this.me.updatedBy = this.me.accountId;
      this.me.firstname = this.form.value.firstname;
      this.me.lastname = this.form.value.lastname;
      this.me.othernames = this.form.value.othernames;
      this.me.description = this.form.value.description;
      this.me.dateOfBirth = this.form.value.dateOfBirth;
      this.me.phone = this.form.value.phone;
      this.me.picture = this.form.value.picture;
      
      this.me.location.updated_at = new Date();
      this.me.location.updatedBy = this.me.accountId;
      this.me.location.province = this.form.value.province.value;
      this.me.location.provinceId = this.form.value.province.value.id;
      this.me.location.city = this.form.value.city.value;
      this.me.location.cityId = this.form.value.city.value.id;
      
      this.me.professionalPreferences.updated_at = new Date();
      this.me.professionalPreferences.updatedBy = this.me.accountId;
      this.me.professionalPreferences.ownMobility = (this.form.value.ownMobility === 'true');
      this.me.professionalPreferences.ownMobilityDescription = this.form.value.ownMobilityDescription;
      
      if (this.isAgent) {
        this.me.professionalPreferences.experience = this.form.value.experience;
        this.me.professionalPreferences.segment = this.form.value.segment;
        this.me.professionalPreferences.companyOfWork = this.form.value.companyOfWork;
        this.me.professionalPreferences.yearsOfExperience = this.form.value.yearsOfExperience;
        this.me.professionalPreferences.purchaseVolume = this.form.value.purchaseVolume.join(',');
      } else {
        this.me.professionalPreferences.comission = this.form.value.comission;
        this.me.professionalPreferences.comissionDescription = this.form.value.comissionDescription;
      }

      this.contactApi.patchAttributes(
        this.me.id,
        this.me
      ).subscribe(
        response => {
          this.locationApi.patchAttributes(
            this.me.location.id,
            this.me.location
          ).subscribe(
            response => {
              this.professionalPreferencesApi.patchAttributes(
                this.me.professionalPreferences.id,
                this.me.professionalPreferences
              ).subscribe(
                response => {
                  this.commonProvider.presentToast('Tus datos de perfil fueron actualizados.');
                  this.loading.dismiss();
        
                  this.close();
                },
                err => {
                  if (err && err.code && err.code === 'SEGMENTS_LIMIT') {
                    const alert = this.alertCtrl.create({
                      title: 'Editar Mi Perfil',
                      subTitle: `El límite de rubros fue excedido (máximo ${err.limit}).`,
                      buttons: ['Ok']
                    });
                    alert.present();
                  } else {
                    this.commonProvider.presentToast('Ocurrió un error al intentar modificar los datos.');
                  }

                  this.loading.dismiss();
                });
            },
            err => {
              this.commonProvider.presentToast('Ocurrió un error al intentar modificar los datos.');
              this.loading.dismiss();
            });
        },
        err => {
          this.commonProvider.presentToast('Ocurrió un error al intentar modificar los datos.');
          this.loading.dismiss();
        });
    }
  }

  public changePicture(): void {
    const mobileButtons = [
      {
        text: 'Camara',
        handler: () => {
          this.imageUpload(1);
        }
      },
      {
        text: 'Biblioteca',
        handler: () => {
          this.imageUpload(0);
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
        }
      }
    ];
    const browserButtons = [
      { 
        text: 'Biblioteca',
        handler: () => {
          this.imageUpload(0);
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

  private imageUpload(source: number): void {
    this.commonProvider.imageUpload(source).then(
      (result) => {
        if (result) {
          const modal = this.modalCtrl.create(PreviewComponent, { 
            data: result, 
            multiple: false 
          });
          modal.present();
          
          modal.onDidDismiss((data) => {
            if (data) {
              const contentType = data.split(';')[0].split(':')[1];
              const b64Data = data.split(';')[1].replace('base64,', '');
              const blob = this.commonProvider.b64toBlob(b64Data, contentType);
              const fileName = `picture.${contentType.replace('image/', '')}`;
              const formData = new FormData();

              formData.append('file', blob, fileName);

              const loading = this.loadingCtrl.create();
              loading.present();

              this.filesApi.uploadProfilePicture(formData).subscribe(
                response => {
                  this.form.controls.picture.setValue(response.url);
                  loading.dismissAll();
                });
            }
          });
        }
      });
  }

  public onSearch(event: {component: IonicSelectableComponent, text: string}, formName: string): void {
    const arrName = formName === 'province'? 'provinces' : 'cities';
    const arr: Array<any> = this[arrName];
    let text = event.text.trim().toLowerCase();

    if (!text) {
      event.component.startSearch();
      event.component.items = arr;
      event.component.endSearch();
      return;
    }

    event.component.startSearch();
    event.component.items = arr.filter((item) => {
      const printable_name = item.value.printable_name.toLowerCase();

      if (printable_name.indexOf(text) !== -1) {
        return item;
      }
    });
    event.component.endSearch();
  }

  public onChange(event: {component: IonicSelectableComponent, value: any}, formName: string): void {
    if (formName === 'province') {
      const provinceId = this.form.controls.province.value.value.id;
      let filter: any = {
        where: {
          printable_name: { neq: 'Cualquier Ciudad' }
        }
      };

      this.loading = this.loadingCtrl.create();
			this.loading.present();
      this.resetCityInfo();

      this.provinceApi.getCities(provinceId, filter).subscribe(
        (response: Array<City>) => {
          response.forEach((item: City) => {
            this.cities.push({
              value: item,
              label: item.printable_name
            });
          });
          
          this.loading.dismissAll();
        });
    }
  }

  private getProvinces(loading: Loading): void {
    const id = this.me.location.countryId;
    const filter = {
      order: 'printable_name',
      where: {
        printable_name: { neq: 'Cualquier Provincia' }
      }
    };

    this.countryApi.getProvinces(id, filter).subscribe(
      (response: Array<Province>) => {
        response.forEach((province: Province) => {
          this.provinces.push({
              value: province,
              label: province.printable_name
          });
        });

        this.getCities(loading);
      });
  }

  private getCities(loading: Loading): void {
    const provinceId = this.me.location.province.id;
    const filter: any = {
      where: {
        printable_name: { neq: 'Cualquier Ciudad' }
      }
    };

    this.provinceApi.getCities(provinceId, filter).subscribe(
      (response: Array<City>) => {
        response.forEach((item: City) => {
          this.cities.push({
            value: item,
            label: item.printable_name
          });
        });

        loading.dismissAll();
      });
  }

  private patchFormValues(): void {
    this.form.patchValue(this.me);

    this.form.controls.country.setValue(this.me.location.country.printable_name);
    this.form.controls.country.disable();

    this.form.controls.postalCode.setValue(this.me.location.city.postal_code);
    this.form.controls.postalCode.disable();

    this.form.controls.province.setValue({
      value: this.me.location.province,
      label: this.me.location.province.printable_name
    });

    this.form.controls.city.setValue({
      value: this.me.location.city,
      label: this.me.location.city.printable_name
    });

    this.form.controls.experience.setValue(this.me.professionalPreferences.experience);
    this.form.controls.companyOfWork.setValue(this.me.professionalPreferences.companyOfWork);
    this.form.controls.yearsOfExperience.setValue(this.me.professionalPreferences.yearsOfExperience);
    this.form.controls.ownMobility.setValue(this.me.professionalPreferences.ownMobility);
    this.form.controls.segment.setValue(this.me.professionalPreferences.segment);

    if (this.me.professionalPreferences.experience) {
      this.form.controls.purchaseVolume.setValue(this.me.professionalPreferences.purchaseVolume.split(','));
    } else {
      this.form.controls.purchaseVolume.setValue([]);
    }

    if (!this.isAgent) {
      if (this.me.professionalPreferences.comission) {
        this.form.controls.comission.setValue(this.me.professionalPreferences.comission);
      } else {
        this.form.controls.comission.setValue('');
      }
  
      if (this.me.professionalPreferences.comissionDescription) {
        this.form.controls.comissionDescription.setValue(this.me.professionalPreferences.comissionDescription);
      } else {
        this.form.controls.comissionDescription.setValue('');
      }
    }
  }

  private getMaxDate(): string {
		const now = new Date();
		let month: any = now.getMonth() + 1;
		let day: any = now.getDate();

		if (month < 10) {
      month = `0${month}`;
    }

    if (day < 10) {
      day = `0${day}`;
    }

		if (this.isAgent) {
			return `${now.getFullYear() - 18}-${month}-${day}`;
    } else {
			return `${now.getFullYear()}-${month}-${day}`;
    }
  }
  
	private resetCityInfo(): void {
    this.cities = [];
    this.form.controls.city.setValue(null);
	}
}
