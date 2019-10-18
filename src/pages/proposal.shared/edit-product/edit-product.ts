import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { ProposalFormProduct } from '../proposal-form/proposal-form';

@Component({
  selector: 'edit-product',
  templateUrl: 'edit-product.html'
})
export class EditProductComponent {
  public product: ProposalFormProduct;
  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) { }

  ngOnInit() {
    this.product = this.navParams.get('data');

    this.form = this.fb.group({
      name: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern(/^[0-9]/)]],
      notes: ['',[Validators.maxLength(200)]]
    });
    this.form.patchValue(this.product);
  }

  public close() {
    this.viewCtrl.dismiss(this.product);
  }

  public save() {
    if (this.form.valid) {
      this.viewCtrl.dismiss(this.form.value);
    }
  }
}
