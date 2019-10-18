import { Component, OnInit } from "@angular/core";
import { ViewController, NavParams } from 'ionic-angular';

@Component({
	selector: 'tos',
	templateUrl: 'tos.html'
})
export class Tos implements OnInit {
  public isAgent: boolean = true;
  public saveOnClose: boolean = false;
  
  constructor(
    private params: NavParams,
    private viewCtrl: ViewController
  ) { }

  ngOnInit() {
    this.saveOnClose = this.params.data && this.params.data.saveOnClose;
    this.isAgent = this.params.data && this.params.data.isAgent;
  }

	public close(): void {
    this.viewCtrl.dismiss();
	}
}
