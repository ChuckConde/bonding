import { Component } from '@angular/core';
import { ViewController, LoadingController, NavController,  Loading } from 'ionic-angular';
import { NavParams } from "ionic-angular/navigation/nav-params";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Contact, CountryApi, City, Country, Province, ProvinceApi } from "../../../sdk";
import { IonicSelectableComponent } from 'ionic-selectable';
import { CommonProvider } from "../../../providers/common/common";
import { PurchaseVolume } from '../../../mockups/purchase-volume';
import { Segments } from '../../../mockups/segments';

@Component({
  selector: 'change-params',
  templateUrl: 'change-params.html'
})
export class ChangeParamsComponent {
	public role: any;
	public me: Contact;
	public isAgent: boolean = true;

	public cities: any = [];
	public provinces: any = [];
	public segments = Segments;
	public pucharseVolumeOptions: any = PurchaseVolume;
	public form: FormGroup;
	public formError: string = '';

	private loading: Loading;

  constructor(
		private viewCtrl: ViewController,
		public navCtrl: NavController,
		public provinceApi: ProvinceApi,
		private params: NavParams,
		private formBuilder: FormBuilder,
		private loadingCtrl: LoadingController,
		public commonProvider: CommonProvider,
		public countryApi: CountryApi
	) { }

	public ngOnInit() {	
		this.me = this.commonProvider.contact;
		this.role = this.commonProvider.role;
		this.isAgent = this.role.name === 'agent';
		
		if (this.isAgent) {
			this.form = this.formBuilder.group({
				othernames: [''],
				description: ['']
			});
		} else {
			const loading: Loading = this.loadingCtrl.create();
			loading.present();

			this.form = this.formBuilder.group({
				keyword: [''],
        segment: [''],
        description: [''],
				purchaseVolume: [''],
				experience: [''],
				ageFrom: [''],
				ageTo: [''],
				country: [''],
				province: [''],
				city: ['']
			});
	
			this.getProvinces(loading);		
		}

		if (this.params.data.prevFilters) {
			this.form.patchValue(this.params.data.prevFilters);
		}
	}

	private getProvinces(loading: Loading): void {
		const filter = {
			where: { iso2: 'ar' }
		};

		this.countryApi.findOne(filter).subscribe(
			(country: Country) => {
				const id = country.id;
				const filter = {
					order: 'printable_name'
				};
				
				this.form.controls.country.setValue(country);

				this.countryApi.getProvinces(id, filter).subscribe(
					(response: Array<Province>) => {
						response.forEach((province: Province) => {
							this.provinces.push({
									value: province,
									label: province.printable_name
							});
						});

						if (this.params.data.prevFilters &&
								this.params.data.prevFilters.city) {
							this.provinceApi.getCities(this.params.data.prevFilters.province.value.id).subscribe(
								(response: Array<City>) => {
									response.forEach((city: City) => {
										this.cities.push({
												value: city,
												label: city.printable_name
										});
									});

									loading.dismiss();
								});
						} else {
							loading.dismiss();
						}
					});
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
	
	public onChange(): void {
		const provinceId = this.form.controls.province.value.value.id;
		
		this.loading = this.loadingCtrl.create();
		this.loading.present();
		this.resetCityInfo();

		this.provinceApi.getCities(provinceId).subscribe(
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

	private resetCityInfo(): void {
		this.form.controls.city.setValue(null);
		this.cities = [];
	}
	
  public close() {
    this.viewCtrl.dismiss();
	}
	
	public clear() {
		for (const val in this.form.controls) {
			this.form.controls[val].setValue('');
		}
	}

	public save(): void {
		this.viewCtrl.dismiss(this.form.value);
	}
}
