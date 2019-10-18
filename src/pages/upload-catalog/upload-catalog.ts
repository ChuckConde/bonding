import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, ViewController, LoadingController, Loading } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { Contact, Files } from "../../sdk";
import { FilesApi } from '../../providers/files';

@IonicPage()
@Component({
  selector: 'upload-catalog',
  templateUrl: 'upload-catalog.html',
})
export class UploadCatalogPage {
  @ViewChild('inputFile')
  private inputFile: ElementRef;

	public isAgent: boolean = true;
	public role: any;
  public me: Contact;
  public catalog: Files;
  public file: File;
  public maxFileSize: boolean = false;

  constructor(
    public viewCtrl: ViewController,
		public commonProvider: CommonProvider,
    public loadingCtrl: LoadingController,
    private filesApi: FilesApi
	) { }

  ngOnInit() {
		this.me = this.commonProvider.contact;
		this.role = this.commonProvider.role;
		this.isAgent = this.role.name === 'agent';
    this.catalog = this.commonProvider.catalog;

    if (this.isAgent) {
      this.close();
      return;
    }
  }

  public openExplorer(): void {
    this.inputFile.nativeElement.click();
  }

  public fileChange(event: any): void {
    this.file = event.target.files && event.target.files[0];

    if (this.file) {
      console.log(this.file);

      this.maxFileSize = this.file.size > 1048576; // 10 mb
      // Check types
    }
  }

  public close() {
    this.viewCtrl.dismiss();
  }

  public save(): void {
    if (this.file && !this.maxFileSize) {
      const formData = new FormData();
      const loading: Loading = this.loadingCtrl.create();

      loading.present();
      formData.append('file', this.file);

      this.filesApi.uploadCatalog(formData).subscribe(
        (catalog: Files) => {
          const toasterMsg: string = this.catalog ? 
            'Tu catalogo fue actualizado exitosamente.' :
            'Tu catalogo fue subido exitosamente.'

          loading.dismissAll();

          this.commonProvider.catalog = catalog;
          this.commonProvider.presentToast(toasterMsg);
          this.close();
        }, 
        (err: any) => {
          const toasterMsg: string = 'Ocurrió un error, intenta nuevamente.';

          loading.dismissAll();
          this.commonProvider.presentToast(toasterMsg);
        });
    }
  }
}
