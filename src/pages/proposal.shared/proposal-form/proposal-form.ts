import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { LoadingController, Loading, ActionSheetController, Platform, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { CountryApi, City, Country, Province, ProvinceApi } from "../../../sdk";
import { IonicSelectableComponent } from 'ionic-selectable';
import { Segments } from '../../../mockups/segments';
import { InvoiceConditions } from '../../../mockups/invoice-conditions';
import { Subscription } from 'rxjs';
import { CommonProvider } from '../../../providers/common/common';
import { PreviewComponent } from '../../../components/preview/preview';
import { dateLessThan } from '../../../validators/date-less-than.validator';
import { EditProductComponent } from '../edit-product/edit-product';

export interface ProposalFormProduct {
  name: string;
  amount: number;
  notes?: string;
}

@Component({
	selector: 'proposal-form',
	templateUrl: 'proposal-form.html'
})
export class ProposalForm {
  @Output()
  public createProposal: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('formContent')
  private formContent: ElementRef;

	public activeStep: number = 1;
	public clientCities: any = [];
	public deliveryCities: any = [];
	public provinces: any = [];
  public products: ProposalFormProduct[] = [];
  public files: any = [];

  public clientForm: FormGroup;
  public deliveryForm: FormGroup;
  public orderForm: FormGroup;

  public segments: any = Segments;
  public invoiceConditions: any = InvoiceConditions;
  public days: Array<string> = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  public paymentMethod: Array<string> = ['Cheque', 'Transferencia', 'Efectivo', 'Tarjeta', 'Otra'];
  public advanceDisabled: boolean = true;

  private loading: Loading;
  private formsSubs: Subscription[] = [];

  constructor(
		private fb: FormBuilder,
    public provinceApi: ProvinceApi,
    public commonProvider: CommonProvider,
		public countryApi: CountryApi,
    private loadingCtrl: LoadingController,
    private platform: Platform,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) {	}

  ngOnInit() {
    const loading: Loading = this.loadingCtrl.create();
    loading.present();
    
    this.clientForm = this.fb.group({
			address: ['', [Validators.required]],
      client: ['', [Validators.required]],
      cuit: ['', [Validators.required, Validators.pattern(/^[0-9\-]+$/)]],
      invoiceConditions: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/)]],
			email: ['', [Validators.required, Validators.email]],
			country: [''],
			province: ['', [Validators.required]],
			city: [{value: '', disabled: true}, [Validators.required]],
			postalCode: ['', [Validators.required]],
      segment: ['', [Validators.required]]
    });
    
		this.deliveryForm = this.fb.group({
			address: ['', [Validators.required]],
      days: ['', [Validators.required]],
      time: this.fb.group({
          startTime:['', [Validators.required]],
          endTime:['', [Validators.required]],
      }, {validator: dateLessThan('startTime', 'endTime')}),
      paymentMethod:['', [Validators.required]],
      comments: ['', [Validators.maxLength(200)]],
      province: ['', [Validators.required]],
			city: [{value: '', disabled: true}, [Validators.required]],
      postalCode: ['', [Validators.required]]
    });

    this.orderForm = this.fb.group({
      name: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern(/^[0-9]/)]],
      notes: ['', [Validators.maxLength(200)]]
    });
    
    this.getProvinces(loading);
    
    this.formsSubs.push(
      this.clientForm.statusChanges.subscribe(() => {
        this.setAdvanceButtonStatus();  
      }),
      this.deliveryForm.statusChanges.subscribe(() => {
        this.setAdvanceButtonStatus();
      }),
      this.orderForm.statusChanges.subscribe(() => {
        this.setAdvanceButtonStatus();
      })
    );
  }

  ngOnDestroy() {
    this.formsSubs.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
	
	private getProvinces(loading: Loading): void {
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
				
				this.clientForm.controls.country.setValue(country);

				this.countryApi.getProvinces(id, filter).subscribe(
					(response: Array<Province>) => {
            this.provinces = response.map((province: Province) => {
              return {
                value: province,
                label: province.printable_name
              }
            });
						loading.dismiss();
					});
			});
	}

	public onSearch(event: {component: IonicSelectableComponent, text: string}, formControl: string, formControlName: string): void {
    const text = event.text && event.text.trim().toLowerCase();
    let arr: Array<any>;

    switch (true) {
      case formControlName === 'province':
        arr = this.provinces;
        break;

      case formControlName === 'city' && formControl === 'clientForm':
        arr = this.clientCities;
        break;
      
      case formControlName === 'city' && formControl === 'deliveryForm':
        arr = this.deliveryCities;
        break;
    }

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

	public onChange(formControl: string, formControlName: string): void {
    if (formControlName === 'province') {
      const provinceId = this[formControl].controls.province.value.value.id;
      const whereFilter = {
        where: {
          printable_name: { neq: 'Cualquier Ciudad' }
        }
      };
      const arrName = formControl.replace('Form', 'Cities');

      this.loading = this.loadingCtrl.create();
      this.loading.present();

      this.provinceApi.getCities(provinceId, whereFilter).subscribe(
        (response: Array<City>) => {
          this[arrName] = response.map((city: City) => {
            return {
							value: city,
              label: city.printable_name
            }
          });

          this[formControl].controls.city.setValue(null);
          this[formControl].controls.city.enable();
          this.loading.dismissAll();
        });
    } else {
      const postalCode = this[formControl].controls.city.value.value.postal_code;
      this[formControl].controls.postalCode.setValue(postalCode);
    }
  }
  
  public onOpen(event: {component: IonicSelectableComponent}): void {
    event.component.search(null);
  }

  public uploadFile(): void {
    const mobileButtons = [
      {
        text: 'Camara',
        handler: () => {
          this.pushFile(1);
        }
      },
      {
        text: 'Biblioteca',
        handler: () => {
          this.pushFile(0);
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
          this.pushFile(0);
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

  private pushFile(source: number): void {
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

              this.orderForm.controls.file.setValue(data);
              
            }
          });
        }
      });
  }
  
  public addProduct(): void {
    if (this.orderForm.valid) {
      this.products.push({
        name: this.orderForm.value.name,
        amount: this.orderForm.value.amount,
        notes: this.orderForm.value.notes
      });
      this.orderForm.reset();
    }
  }

  public productOptions(product: ProposalFormProduct, index: number): void {
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Editar producto',
          handler: () => {
            this.editProduct(product, index);
          }
        },
        {
          text: 'Eliminar producto',
          handler: () => {
            this.removeProduct(index);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });

    actionSheet.present();
  }

  public editProduct(product: ProposalFormProduct, index: number) {
    const modal = this.modalCtrl.create(
      EditProductComponent, 
      { data: product },
      { enableBackdropDismiss: false }
    );
    modal.present();

    modal.onDidDismiss((data) => {
      this.products[index] = data;
    });
  }

  public removeProduct(position: number): void {
    this.products.splice(position, 1);
  }

  public goBack(): void {
    if (this.activeStep > 1) {
      this.activeStep--;
      this.setAdvanceButtonStatus();
		}
  }

  public advance(): void {	
    if (this.activeStep !== 3) {
      this.activeStep++;
      this.formContent.nativeElement.scroll(0, 0);
      this.setAdvanceButtonStatus();
    }	else {
      this.save();
    }
  }

  private save(): void {
    const data = {
      clientData: this.clientForm.value,
      deliveryData: this.deliveryForm.value,
      orderData: {
        products: this.products
      }
    };

    this.createProposal.emit(data);
  }
  
  private setAdvanceButtonStatus(): void {
    switch (this.activeStep) {
      case 1:
        this.advanceDisabled = !this.clientForm.valid;
        break;

      case 2:
        this.advanceDisabled = !this.deliveryForm.valid;
        break;

      case 3:
        this.advanceDisabled = !this.products.length;
        break;
    }
  }
}
