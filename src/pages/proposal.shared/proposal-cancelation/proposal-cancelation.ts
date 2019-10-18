import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Conversation, ConversationApi } from '../../../sdk';
import { CommonProvider } from '../../../providers/common/common';
import { Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'proposal-cancelation',
  templateUrl: 'proposal-cancelation.html'
})
export class ProposalCancelationComponent {
  public conversation: Conversation;
  public isAgent: boolean = true;
	public role: any;
  public textareaControl: FormControl = new FormControl(null, {
    validators: [Validators.required, Validators.maxLength(200)]
  });
  public calification: FormControl = new FormControl(null, {
    validators: [Validators.required]
  });
  public isCalification: boolean;

  constructor(
    public navParams: NavParams,
    public commonProvider: CommonProvider,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public conversationApi: ConversationApi
  ) { }

  ngOnInit() {
    this.role = this.commonProvider.role;
		this.isAgent = this.role.name === 'agent';    
    this.conversation = this.navParams.get('conversation');
    this.isCalification = this.navParams.get('isCalification');
  }

  public confirm(): void {
    if (!this.isCalification) {
      const alert = this.alertCtrl.create({
        title: 'Propuestas',
        subTitle: '¿Estás seguro que deseas cancelar la propuesta en tránsito?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {}
          },
          {
            text: 'Confirmar',
            handler: () => {
              const loading = this.loadingCtrl.create();
              loading.present();
  
              this.conversationApi.cancelProposal(this.conversation.id, {
                comments: this.textareaControl.value
              }).subscribe((response: Conversation) => {
                loading.dismissAll();
                this.viewCtrl.dismiss(response);
              });
            }
          }
        ]
      });
      alert.present();
    } else {
      this.viewCtrl.dismiss({
        calification: this.calification.value,
        comment: this.textareaControl.value
      });
    }
  }

  public setCalification(value: number): void {
    this.calification.markAsDirty();
    this.calification.setValue(value);
  }

  public close() {
    this.viewCtrl.dismiss();
  }
}
