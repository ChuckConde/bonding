import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, Events, LoadingController, Loading} from 'ionic-angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountApi, CountryApi, ProvinceApi, CityApi, Country, Province, City, Contact } from '../../sdk/index';
import { IonicSelectableComponent } from 'ionic-selectable';
import { DomSanitizer } from '@angular/platform-browser';
import { Segments } from '../../mockups/segments';
import { CommonProvider } from '../../providers/common/common';
import { Genders } from '../../mockups/genders';
import { YearsOfExperience } from '../../mockups/years-of-experience';
import { PurchaseVolume } from '../../mockups/purchase-volume';

@IonicPage()
@Component({
  selector: 'page-walkthrough',
  templateUrl: 'walkthrough.html'
})
export class WalkthroughPage implements OnInit {
  @ViewChild(Slides) 
  public slider: Slides;

	public showUserGreeting: boolean = true;
	public fadeOut: boolean = false;
	public form: FormGroup;
  
  public isAgent: boolean = true;
	public role: any;
  public me: Contact;
  
	public loading: Loading;
	public provinces: any = [];

	public cities: any = [];

	public addNewWorkLocation: boolean = false;
	public workLocationsAmount: number = 1;
	public workLocationsList: any = [];
	
	public slides: Array<any>;
	public currentIndex: number = 0;
	public enableContinue: boolean = false;
	public maxDate: any;

	/**
	 * @method constructor
	 * @param navCtrl
	 * @param navParams
	 * @param countryApi
	 * @param accountApi
	 * @param provinceApi
	 */
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public fb: FormBuilder,
		private events: Events,
		public countryApi: CountryApi,
		public accountApi: AccountApi,
		public provinceApi: ProvinceApi,
		public cityApi: CityApi,
		public loadingCtrl: LoadingController,
    public domSanitizer: DomSanitizer,
    public commonProvider: CommonProvider    
	) { }

	/**
	 * configure slide data
	 * @method ngOnInit
	 */
	public ngOnInit(): void {
    this.me = this.commonProvider.contact;
		this.role = this.commonProvider.role;
    this.isAgent = this.role.name === 'agent';
    
		this.form = this.fb.group({
      experience: ['', [Validators.required]],
			dateOfBirth: ['', [Validators.required]],
			provinceOfOrigin: ['', [Validators.required]],
			cityOfOrigin: ['', [Validators.required]],
			gender: ['', [Validators.required]],
      provinceOfWork_1: ['', [Validators.required]],
      cityOfWork_1: ['', [Validators.required]],
			segment: ['', [Validators.required]],
			yearsOfExperience: ['', [Validators.required]],
			company: ['', Validators.maxLength(200)],
			purchaseVolume: [''],
      country: [''],
			othernames: [''],
			description: [''],
			comission: [''],
			comissionDescription: ['']
		});

		/** Prevent swipe without validation */
		this.slider.lockSwipes(true);

		/** Get provinces list */
		this.getProvinces();
		
    if (this.isAgent) {
			this.setAgentSlides();
    } else {
			this.setCompanySlides();
		}

		this.form.valueChanges.subscribe(
			() => {
				this.validSlide() ? this.enableContinue = true : this.enableContinue = false;
			});
	}

	public closeGreeting(): void {
    this.fadeOut = true;
    
		setTimeout(() => {
			this.showUserGreeting = false;
		}, 200);
	}

	private getProvinces(): void {
		const filter = {
			where: { iso2: 'ar' }
		};

		this.countryApi.findOne(filter).subscribe(
			(country: Country) => {
				const id = country.id;
				const filter = {
					order: 'printable_name',
					where: {
						printable_name: { neq: 'Cualquier Provincia' }
					}
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
					});
			});
	}

	private setAgentSlides(): void {
		this.setMaxDate(true);
		this.form.controls.segment.setValidators([Validators.required, Validators.maxLength(8)]);

		this.slides = [
			{
				inputs: [
					{
						label: 'Nivel de experiencia',
						type: 'checkbox',
						options: [
							{
								value: true,
								label: 'Tengo experiencia en ventas'
							}, 
							{
								value: false,
								label: 'Mis primeras ventas'
							}
						],
						multiple: false,
						error: 'Debes indicar tu nivel de experiencia.',
						formName: 'experience'
					}
				],
				title: '¿Cuál es tu nivel de experiencia?',
				help: this.domSanitizer.bypassSecurityTrustHtml('Vamos con la primera pregunta. Necesitamos saber si tenes experiencia en <strong style="text-decoration: underline;">ventas</strong>. Si no la tenes no te preocupes, esto no va a limitar las posibilidades de negocios!')
			},
			{
				inputs: [
					{
						label: 'Selecciona una fecha',
						type: 'date',
						error: 'Indica tu fecha de nacimiento.',
						formName: 'dateOfBirth'
					}
				],
				title: '¿Cuándo naciste?'
			},
			{
				inputs: [
					{
						label: 'Provincia',
						type: 'selectable',
						error: 'Indica tu Provincia',
						options: 'provinces',
						canSearch: true,
						hasVirtualScroll: false,
						formName: 'provinceOfOrigin',
						showField: true
					},
					{
						label: 'Ciudad',
						type: 'selectable',
						error: 'Indica tu Ciudad',
						options: 'cities',
						canSearch: true,
						hasVirtualScroll: true,
						formName: 'cityOfOrigin',
						showField: true
					}
				],
				title: '¿En qué Provincia/Ciudad vives actualmente?'
			},
			{
				inputs: [
					{
						label: 'Género',
						type: 'checkbox',
						options: Genders,
						multiple: false,
						error: 'Indica tu género',
						formName: 'gender'
					}
				],
				title: '¿Género?'
			},
			{
				inputs: [
					{
						label: 'Provincia',
						type: 'selectable',
						error: 'Indica una Provincia',
						options: 'provinces',
						canSearch: true,
						hasVirtualScroll: false,
						formName: 'provinceOfWork_1',
						showField: true
					},
					{
						label: 'Ciudad',
						type: 'selectable',
						error: 'Indica una Ciudad',
						options: 'cities',
						canSearch: true,
						hasVirtualScroll: true,
						formName: 'cityOfWork_1',
						showField: true
					}
				],
				title: '¿En que provincia/ciudad quieres hacer negocios?',
				help: "Este punto es vital para conectarte con personas y empresas que quieran hacer negocios en las mismas zonas o lugares que tú tienes influencia o ya trabajas. ¡Se especificó en cuanto a provincias y ciudades!",
				workZones: true
			},
			{
				inputs: [
					{
						label: 'Rubros',
						type: 'checkbox',
						options: Segments,
						multiple: true,
						error: 'Indica al menos un Rubro o Segmento y hasta máximo ocho',
						formName: 'segment'
					}
				],
				title: 'En cuales de los siguientes campos o segmentos te interesa hacer negocios?',
				help: 'Es vital que señales en que campos quieres hacer negocios, esto nos permitirá acercarte mejores propuestas. Si no encuentras el indicado, señala uno parecido. ¡Puedes agregar hasta ocho!'
			}
		];
	}

	private setCompanySlides(): void {
		this.setMaxDate(false);

		this.form.controls.othernames.setValidators([Validators.required]);
		this.form.controls.description.setValidators([
			Validators.required,
			Validators.minLength(30),
			Validators.maxLength(200)
		]);
		this.form.controls.comission.setValidators([
			Validators.required,
			Validators.min(1),
			Validators.max(100)
		]);
		this.form.controls.comissionDescription.setValidators([
			Validators.maxLength(200)
		]);
		this.form.controls.experience.setValue(true);
		this.form.controls.gender.setValue('other');

		this.slides = [
			{
				inputs: [
					{
						label: 'Razón social',
						type: 'text',
						formName: 'othernames',
						error: 'Indica la razón social de tu empresa.'
					},
					{
						label: 'Descripcion',
						type: 'textarea',
						formName: 'description',
						error: 'La descripcion debe ser de entre 30 y 199 caracteres.'
					}
				],
				title: 'Razón Social',
				help: 'Ingresa la razón social de tu empresa o el nombre y apellido del responsable. La descripción va a facilitar que los agentes te encuentran en las búsquedas.'
			},
			{
				inputs: [
					{
						label: 'Comisión',
						type: 'number',
						formName: 'comission',
						error: 'Indica el porcentaje comisión de tu empresa.'
					},
					{
						label: 'Descripción',
						type: 'textarea',
						formName: 'comissionDescription',
						error: 'La descripción puede tener como máximo 200 caracteres.'
					}
				],
				title: 'Comisión',
				help: 'Ingresa la comisión que ofrecerás a los agentes.'
			},
			{
				inputs: [
					{
						label: 'Selecciona una fecha',
						type: 'date',
						error: 'Indica la fecha de inicio de actividades de tu empresa.',
						formName: 'dateOfBirth'
					}
				],
				title: '¿Cuándo iniciaron sus actividades?'
			},
			{
				inputs: [
					{
						label: 'Provincia',
						type: 'selectable',
						error: 'Indica tu Provincia',
						options: 'provinces',
						canSearch: true,
						hasVirtualScroll: false,
						formName: 'provinceOfOrigin',
						showField: true
					},
					{
						label: 'Ciudad',
						type: 'selectable',
						error: 'Indica tu Ciudad',
						options: 'cities',
						canSearch: true,
						hasVirtualScroll: true,
						formName: 'cityOfOrigin',
						showField: true
					}
				],
				title: '¿En qué Provincia/Ciudad se encuentra tu empresa?',
				help: 'Si tu empresa tiene sucursales en más de una ciudad, indica la locación de la casa matriz.'
			},
			{
				inputs: [
					{
						label: 'Rubros',
						type: 'checkbox',
						options: Segments,
						multiple: false,
						error: 'Debes seleccionar un único rubro o segmento.',
						formName: 'segment'
					}
				],
				title: '¿En cuales de los siguientes campos o segmentos tu empresa hace negocios?'
			},
			{
				inputs: [
					{
						label: 'Provincia',
						type: 'selectable',
						error: 'Indica una Provincia',
						options: 'provinces',
						canSearch: true,
						hasVirtualScroll: false,
						formName: 'provinceOfWork_1',
						showField: true
					},
					{
						label: 'Ciudad',
						type: 'selectable',
						error: 'Indica una Ciudad',
						options: 'cities',
						canSearch: true,
						hasVirtualScroll: true,
						formName: 'cityOfWork_1',
						showField: true
					}
				],
				title: '¿En qué zonas deseas operar?',
				help: "Este punto es vital para conectarte con agentes que quieran hacer negocios en las mismas zonas o lugares que tú tienes influencia o ya trabajas. ¡Se especificó en cuanto a provincias y ciudades!",
				workZones: true
			}
		];
	}

	private setMaxDate(isAgent: boolean): void {
		const now = new Date();
		let month: any = now.getMonth() + 1;
		let day: any = now.getDate();

		if ( month < 10 ) month = `0${month}`; 
    if ( day < 10 ) day = `0${day}`;
		
		if (isAgent)
			this.maxDate = `${now.getFullYear() - 18}-${month}-${day}`;
		else
			this.maxDate = `${now.getFullYear()}-${month}-${day}`;
	}

	private validSlide(): boolean {
		const activeIndex = this.slider.getActiveIndex();
		let workLocationSlide: boolean = false;
		let retval = true;
		
		if (this.slides && this.slides[activeIndex]) {

      this.slides[activeIndex].inputs.forEach(element => {
        const formName = element.formName;
				
				if (!this.form.controls[ formName ].valid) {
          retval = false;
        }
        
				if (formName.indexOf('cityOfWork') !== -1) {
          workLocationSlide = true;
        }
			});
    } else {
			retval = false;
    }
		
		if (workLocationSlide && retval) {
			this.addNewWorkLocation = true;
    } else {
			this.addNewWorkLocation = false;
    }

		return retval;
	}

	public next(): void {
		this.nextSlide();
		this.resetCityInfo();

    if (this.isAgent &&
        this.currentIndex && 
        this.currentIndex === 1 && 
        this.form.controls.experience.value === 'true') {
      this.setExperiencesAgentsSlides();
    }

		if (this.slides[this.currentIndex] && this.slides[this.currentIndex].workZones) {
			this.loading = this.loadingCtrl.create();
			this.loading.present();

			const filter = {
				where: { iso2: 'ar' }
			};
	
			this.countryApi.findOne(filter).subscribe(
				(country: Country) => {
					const id = country.id;
					const filter = {
						order: 'printable_name'
					};

					this.countryApi.getProvinces(id, filter).subscribe(
						(response: Array<Province>) => {
							this.provinces = [];

							response.forEach((province: Province) => {
								this.provinces.push({
										value: province,
										label: province.printable_name
								});
							});

							this.loading.dismissAll();
						});
				});
		} else {
			this.addNewWorkLocation = false;
			this.workLocationsList = [];
	
			if (this.currentIndex === this.slider.length()) {
				this.events.publish('walkthroughComplete', this.form.value);
      }
		}
	}
  
	private setExperiencesAgentsSlides(): void 	{
		this.form.controls.purchaseVolume.setValidators([Validators.required]);

		this.slides.push(
			{
				inputs: [
					{
						label: 'Nivel de experiencia',
						type: 'checkbox',
						options: YearsOfExperience,
						multiple: false,
						error: 'Indica los años de experiencia',
						formName: 'yearsOfExperience',
						help: 'Debes ser lo más preciso posible en este punto, el nivel de experiencias que tengas no perjudicará en absoluto las oportunidades de negocios! '
					}
				],
				title: 'Indica tus años de experiencia.'
			},
			{
				inputs: [
					{
						label: '¿Quiénes son tus clientes?',
						type: 'textarea',
						formName: 'company',
						error: 'El texto ingresado no debe superar los 200 caracteres.'
					}
				],
				title: '¿Quiénes son tus clientes?',
				help: 'Este punto es totalmente opcional, pero cabe destacar que mientras información aportes acerca de ti, más beneficios tendrás a la hora de las propuestas!'
			},
			{
				inputs: [
					{
						label: 'Volumen de mis clientes',
						type: 'checkbox',
						options: PurchaseVolume,
						multiple: true,
						error: 'Indica el volumen de tus clientes',
						formName: 'purchaseVolume'
					}
				],
				title: 'Tus clientes, ¿qué volumen de compra manejan?'
			}
		);
	}

	private nextSlide(): void {
		this.slider.lockSwipes(false);
		this.slider.slideNext();
		this.slider.lockSwipes(true);
		
		this.enableContinue = false;

		this.validSlide() ? this.enableContinue = true : this.enableContinue = false;
		
		this.currentIndex++;
	}

	public onChange(event: {component: IonicSelectableComponent, value: any}, formName: string): void {
    if (formName.indexOf('province') !== -1) {
      const provinceId = event.value.value.id;
      let filter: any = {};

      if (formName === 'provinceOfOrigin') {
        filter = {
          where: {
            printable_name: { neq: 'Cualquier Ciudad' }
          }
        };
      }

      this.loading = this.loadingCtrl.create();
			this.loading.present();
			this.resetCityInfo(formName);
			
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

	public onSearch(event: {component: IonicSelectableComponent, text: string}, formName: string): void {
		const arrName = formName.indexOf('province') !== -1 ? 'provinces' : 'cities';
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

	public addWorkLocation(): void {
		const activeIndex = this.slider.getActiveIndex();

		const province = this.form.controls[`provinceOfWork_${this.workLocationsAmount}`].value.label; 
		const city = this.form.controls[`cityOfWork_${this.workLocationsAmount}`].value.label;

		this.workLocationsList.push({
			province: province, 
			city: city
		});
	
		this.workLocationsAmount++;
		
		this.form.addControl(
			`provinceOfWork_${this.workLocationsAmount}`, 
			new FormControl('', Validators.required)
		);
		this.form.addControl(
			`cityOfWork_${this.workLocationsAmount}`, 
			new FormControl('', Validators.required)
		);

		this.slides[activeIndex].inputs = this.slides[activeIndex].inputs.map((item) => {
				item.showField = false;
				return item;
		});

		this.slides[activeIndex].inputs.push(
			{
				label: 'Provincia',
				type: 'selectable',
				error: 'Indica una Provincia',
				options: 'provinces',
				canSearch: true,
				hasVirtualScroll: false,
				formName: `provinceOfWork_${this.workLocationsAmount}`,
				showField: true
			}
		);
		this.slides[activeIndex].inputs.push(
			{
				label: 'Ciudad',
				type: 'selectable',
				error: 'Indica una Ciudad',
				options: 'cities',
				canSearch: true,
				hasVirtualScroll: true,
				formName: `cityOfWork_${this.workLocationsAmount}`,
				showField: true
			}
		);

		this.resetCityInfo();
		this.validSlide() ? this.enableContinue = true : this.enableContinue = false;
	}

	private resetCityInfo(formName?: string): void {
		if (formName) {
			this.form.controls[formName.replace('province' ,'city')].setValue(null);
		}
		this.cities = [];
	}
}
