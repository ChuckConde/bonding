import { Component, ViewChild, ElementRef } from "@angular/core";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { ViewController, LoadingController } from "ionic-angular";
import { ConversationApi, Conversation } from "../../../sdk";
import { CommonProvider } from "../../../providers/common/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { FilesApi } from "../../../providers/files";

@Component({
  selector: 'proposal-acceptation',
  templateUrl: 'proposal-acceptation.html'
})
export class ProposalAcceptationComponent {
  @ViewChild('inputFile')
  private inputFile: ElementRef;
  
  public conversation: Conversation;
  public isAgent: boolean = true;
  public role: any;
  public form: FormGroup;
  public formSubscription: Subscription;
  public file: File;
  public maxFileSize: boolean = false;

  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public conversationApi: ConversationApi,
    private commonProvider: CommonProvider,
    private fb: FormBuilder,
    private filesApi: FilesApi
  ) { }

  ngOnInit() {
    this.role = this.commonProvider.role;
		this.isAgent = this.role.name === 'agent';    
    this.conversation = this.navParams.get('data');

    this.form = this.fb.group({
      commision: [this.conversation.commision, Validators.required],
      totalAmount: [null, Validators.required],
      commisionAmount: [{value: null, disabled: true}, Validators.required]
    });
    this.formSubscription = this.form.valueChanges.subscribe(() => {
      const totalAmount = parseInt(this.form.value.totalAmount) || 0;
      const commision = parseInt(this.form.value.commision) || 0;
      const value = totalAmount * commision / 100;

      this.form.controls.commisionAmount.setValue(value, {
        onlySelf: true
      });
    });
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  public openExplorer(): void {
    this.inputFile.nativeElement.click();
  }

  public fileChange(event: any): void {
    this.file = event.target.files && event.target.files[0];

    if (this.file) {
      this.maxFileSize = this.file.size > 1048576; // 10 mb
      // Check types
    }
  }

  public confirm(): void {
    const loading = this.loadingCtrl.create();
    const formData = new FormData();
    
    loading.present();

    formData.append('file', this.file);
    
    this.conversationApi.sendInvoice(this.conversation.id, {
      commision: this.form.value.commision,
      totalAmount: this.form.value.totalAmount,
      commisionAmount: this.form.get('commisionAmount').value,
    }).subscribe((response: Conversation) => {
      loading.dismissAll();
      this.viewCtrl.dismiss(response);
    });
  }

  public close(): void {
    this.viewCtrl.dismiss();
  }
}
