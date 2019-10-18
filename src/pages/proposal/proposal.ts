import { Component, SimpleChanges } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController, ModalController, Events } from 'ionic-angular';
import { ConversationApi, Contact, Conversation, LoopBackFilter } from '../../sdk';
import { CommonProvider } from '../../providers/common/common';
import { ProposalDetailsComponent } from '../proposal.shared/proposal-details/proposal-details';

@IonicPage()
@Component({
  selector: 'page-proposal',
  templateUrl: 'proposal.html',
})
export class ProposalPage {
  public role: any;
	public me: Contact;
	public isAgent: boolean = true;
  public company: any;
  public conversation: Conversation;

  public initProposal: boolean = false;
  public discardProposal: boolean = false;
  public canLeave: boolean = true;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private conversationApi: ConversationApi,
    public commonProvider: CommonProvider,
    private modalCtrl: ModalController,
    private events: Events
  ) { }

  ngOnInit() {
    this.me = this.commonProvider.contact;
		this.role = this.commonProvider.role;
    this.isAgent = this.role.name === 'agent';
    
    this.company = this.navParams.get('company');
    this.conversation = this.navParams.get('conversation');

    console.log('ionViewDidLoad ProposalPage');
    console.log('company', this.company);
    console.log('conversation', this.conversation);

    if (this.conversation) {
      this.goToChat();
      this.events.subscribe('activeConversationsChange', (conversations: Conversation[]) => {
        const conversation = conversations.find(conversation => conversation.id === this.conversation.id);
        
        if (conversation) {
          this.conversation = conversation
        }
      });
    } else {
      this.buildProposalForm();
    }
  }

  ionViewCanLeave(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (!this.canLeave && this.initProposal) {
        console.log('confirm leaving');
        const alert = this.alertCtrl.create({
          title: 'Propuestas',
          subTitle: 'La propuesta aún no se inicio, los datos ingresados van a perderse. ¿Estás seguro que deseas continuar?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                reject();
              }
            },
            {
              text: 'Confirmar',
              handler: () => {
                this.canLeave = true;
                this.discardProposal = true;
                
                resolve(this.canLeave);
              }
            }
          ]
        });
  
        alert.present();
      } else{ 
        resolve(this.canLeave);
      }
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('activeConversationsChange');
  }

  public createProposal(proposalData: any): void {
    const loading = this.loadingCtrl.create();
    loading.present();

    proposalData.company = this.company;
    proposalData.deliveryData.endTime = proposalData.deliveryData.time.endTime;
    proposalData.deliveryData.startTime = proposalData.deliveryData.time.startTime;

    this.conversationApi.createProposal(proposalData).subscribe(
      (response) => {
        loading.dismissAll();
          
        this.conversation = response;
        this.goToChat();

        this.events.subscribe('activeConversationsChange', (conversations: Conversation[]) => {
          const conversation = conversations.find(conversation => conversation.id === this.conversation.id);
        
          if (conversation) {
            this.conversation = conversation
          }
        });
      });
  }

  public openProposalDetails(): void {
    const modal = this.modalCtrl.create(ProposalDetailsComponent, {
      data: this.conversation
    });
    modal.present();
  }

  private buildProposalForm(): void {
    this.initProposal = true;
    this.canLeave = false;
  }

  private goToChat(): void {
    this.initProposal = false;
    this.canLeave = true;
  }
}
