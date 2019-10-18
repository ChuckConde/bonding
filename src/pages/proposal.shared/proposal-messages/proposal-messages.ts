import { Component, OnInit, ViewChild, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LoadingController,Events } from 'ionic-angular';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { CommonProvider } from '../../../providers/common/common';
import { Contact, Conversation, FireLoopRef, Message, RealTime, ConversationApi, LoopBackFilter, MessageApi, ConversationCalificationApi, ConversationCalification } from '../../../sdk';
import { Subscription } from 'rxjs';
import { ProposalCancelationComponent } from '../proposal-cancelation/proposal-cancelation';
import { ProposalAcceptationComponent } from '../proposal-acceptation/proposal-acceptation';

@Component({
  selector: 'proposal-messages',
  templateUrl: 'proposal-messages.html'
})

/**
 * real time chat with a recipient, insert image and send message to contact
 * @class ChatMessage
 * @implements OnInit
 */
export class ProposalMessages implements OnInit, OnChanges {
  @Input()
  public conversation: Conversation;

  @ViewChild('chatContent')
  private chatContent: ElementRef;

  @ViewChild('textareaRef')
  private textareaRef: ElementRef;

  public role: any;
	public me: Contact;
  public isAgent: boolean = true;
  
  public messages: Message[] = [];

  public messageControl: FormControl = new FormControl();
  public textareaHeight: number = 26;

  public calificationSended: boolean = false;

  private messageRef: FireLoopRef<Message>;
  private conversationRef: FireLoopRef<Conversation>;
  private subscriptions: Subscription[] = [];

  constructor(
    public commonProvider: CommonProvider,
    public loadingCtrl: LoadingController,
    public rt: RealTime,
    public modalCtrl: ModalController,
    public conversationApi: ConversationApi,
    public messageApi: MessageApi,
    private events: Events,
    private conversationCalificationApi: ConversationCalificationApi
  ) { }

  ngOnInit() {
    this.me = this.commonProvider.contact;
		this.role = this.commonProvider.role;
    this.isAgent = this.role.name === 'agent';

    console.log('ProposalMessages::ngOnInit:conversation', this.conversation);

    if (this.conversation.is_archived || this.conversation.is_deleted || this.conversation.state === 'COMMISSION_PAID') {
      const loading = this.loadingCtrl.create();

      this.messageControl.disable();
      this.messageApi.find({
        where: { 
          and: [
            { 
              is_deleted: false,
              conversationId: this.conversation.id
            }
          ] 
        }, 
        order: 'created_at ASC'
      }).subscribe((response: Message[]) => {
        this.messages = response;
        
        setTimeout(() => {
          this.scrollBottom();
        }, 10);

        if (this.conversation.state === 'COMMISSION_PAID') {
          console.log('check califications')
          this.conversationCalificationApi.find({
            where: {
              conversationId: this.conversation.id,
              createdBy: this.me.accountId
            }
          }).subscribe((response: ConversationCalification[]) => {
            console.log(response);
            if (!response.length) {
              this.sendCalification();
              loading.dismiss();
            } else {
              this.calificationSended = true;
              loading.dismiss();
            }
          });
        } else {
          loading.dismiss();
        }
      });
      
      loading.present();
      return;
    }
    
    // this.rt.onDisconnect
    if (this.rt.connection.isConnected() && this.rt.connection.authenticated) {
      this.subscriptions.push(
        this.rt.onReady().subscribe(() => this.getMessages())
      );
    } else {
      this.subscriptions.push(
        this.rt.onAuthenticated().subscribe(() => this.getMessages()),
        this.rt.onReady().subscribe()
      );
    }

    this.events.subscribe('cancelProposal', () => {
      this.cancelProposal();
    });

    this.events.subscribe('sendInvoice', () => {
      this.sendInvoice();
    });

    this.events.subscribe('cancelProposalByDelivered', () => {
      this.cancelProposalByDelivered();
    });

    this.events.subscribe('markAsDelivered', () => {
      this.markAsDelivered();
    });

    this.events.subscribe('confirmDelivered', () => {
      this.confirmDelivered();
    });

    this.events.subscribe('rejectDeliveredMark', () => {
      this.rejectDeliveredMark();
    });

    this.events.subscribe('markAsPaid', () => {
      this.markAsPaid();
    });

    this.events.subscribe('confirmPayment', () => {
      this.confirmPayment();
    });

    this.events.subscribe('rejectPaymentMark', () => {
      this.rejectPaymentMark();
    });

    this.events.subscribe('markCommisionPaid', () => {
      this.markCommisionPaid();
    });

    this.events.subscribe('confirmCommisionPaid', () => {
      this.confirmCommisionPaid();
    });

    this.events.subscribe('rejectCommisionPaid', () => {
      this.rejectCommisionPaid();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes)
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });

    this.events.unsubscribe('cancelProposal');
    this.events.unsubscribe('sendInvoice');
    this.events.unsubscribe('cancelProposalByDelivered');
    this.events.unsubscribe('markAsDelivered');
    this.events.unsubscribe('confirmDelivered');
    this.events.unsubscribe('rejectDeliveredMark');
    this.events.unsubscribe('markAsPaid');
    this.events.unsubscribe('confirmPayment');
    this.events.unsubscribe('rejectPaymentMark');
    this.events.unsubscribe('markCommisionPaid');
    this.events.unsubscribe('confirmCommisionPaid');
    this.events.unsubscribe('rejectCommisionPaid');
  }

  public sendMessage(): void {
    if (
      !this.messageControl.value || 
      this.conversation.is_archived || 
      this.conversation.is_deleted || 
      this.conversation.state === 'COMMISSION_PAID'
    ) {
      return;
    }

    const message: string = this.messageControl.value;
    const messageObj = this.buildMessage(message);
    
    this.messageControl.reset();
    this.textareaHeight = 26;
    this.textareaRef.nativeElement.focus();
    
    console.log('sendMessage', messageObj);
    const messageRefSub = this.messageRef.upsert(messageObj).subscribe(
      (response: Message) => {
        console.log(response)
        messageRefSub.unsubscribe();

        this.conversation.updated_at = new Date();
        this.conversation.updatedBy = this.me.accountId;

        const conversationRefSub = this.conversationRef.upsert(this.conversation).subscribe(
          (res) => {
            conversationRefSub.unsubscribe();
          })
      },
      (err: any) => {
        console.log(err);
        messageRefSub.unsubscribe();
      }
    );
  }

  public onKeydown(event): void {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.sendMessage();
      return;
    }
    
    this.adjustTextareaHeight();
  }

  public adjustTextareaHeight(): void {
    if (this.textareaRef.nativeElement.scrollHeight < 120) {
      this.textareaHeight = this.textareaRef.nativeElement.scrollHeight;
    } else {
      this.textareaHeight = 120;
    }
  }

  public sendInvoice(): void {
    const modal = this.modalCtrl.create(
      ProposalAcceptationComponent,
      { data: this.conversation },
      { enableBackdropDismiss: false }
    );
    modal.present();
    modal.onDidDismiss((response?: Conversation) => {
      if (response) {
        this.updateConversationStatus(response, 'PENDING_ACCEPT_MSG');
      }
    });
  }

  public cancelProposal(): void {
    const modal = this.modalCtrl.create(
      ProposalCancelationComponent,
      { 
        conversation: this.conversation,
        isCalification: false 
      },
      { enableBackdropDismiss: false }
    );
    modal.present();
    modal.onDidDismiss((response?: Conversation) => {
      if (response) {
        this.updateConversationStatus(response, 'FINALIZED_MSG');
      }
    });
  }

  public sendCalification(): void {
    const modal = this.modalCtrl.create(
      ProposalCancelationComponent,
      { 
        conversation: this.conversation,
        isCalification: true 
      },
      { enableBackdropDismiss: false }
    );
    modal.present();
    modal.onDidDismiss((response?: any) => {
      console.log(response)
      if (response) {
        const loading = this.loadingCtrl.create();

        this.conversationCalificationApi.create({
          rate: response.calification,
          comments: response.comments,
          created_at: new Date(),
          updated_at: new Date(),
          is_deleted: false,
          createdBy: this.me.accountId,
          updatedBy: this.me.accountId
        }).subscribe((response) => {
          loading.dismiss();
        });

        loading.present();
      }
    });
  }

  public rejectInvoice(): void {
    const loading = this.loadingCtrl.create();

    loading.present();

    this.conversationApi.rejectInvoice(this.conversation.id).subscribe((response: Conversation) => {
      loading.dismiss();
      this.updateConversationStatus(response, 'REJECT_INVOICE_MSG');
    });
  }

  public acceptProposal(): void {
    const loading = this.loadingCtrl.create();

    loading.present();

    this.conversationApi.acceptProposal(this.conversation.id).subscribe((response: Conversation) => {
      this.updateConversationStatus(response, 'ACCEPTED_MSG');
      loading.dismiss();
    });
  }

  public cancelProposalByDelivered(): void {
    console.log('cancelProposalByDelivered');
  }

  public markAsDelivered(): void {
    const loading = this.loadingCtrl.create();

    loading.present();

    this.conversationApi.markAsDelivered(this.conversation.id).subscribe((response: Conversation) => {
      console.log(response);
      this.updateConversationStatus(response, 'PENDING_DELIVERED_APROVAL_MSG');
      loading.dismiss();
    });
  }

  public confirmDelivered(): void {
    const loading = this.loadingCtrl.create();

    loading.present();

    this.conversationApi.confirmDelivered(this.conversation.id).subscribe((response: Conversation) => {
      console.log(response);
      this.updateConversationStatus(response, 'DELIVERED_APROVAL_MSG');
      loading.dismiss();
    });
  }

  public rejectDeliveredMark(): void {
    const loading = this.loadingCtrl.create();

    loading.present();

    this.conversationApi.rejectDeliveredMark(this.conversation.id).subscribe((response: Conversation) => {
      console.log(response);
      this.updateConversationStatus(response, 'REJECT_DELIVERED_MARK_MSG');
      loading.dismiss();
    });
  }

  public markAsPaid(): void {
    const loading = this.loadingCtrl.create();

    loading.present();

    this.conversationApi.markAsPaid(this.conversation.id).subscribe((response: Conversation) => {
      console.log(response);
      this.updateConversationStatus(response, 'PENDING_PAYMENT_APROVAL_MSG');
      loading.dismiss();
    });
  }

  public confirmPayment(): void {
    const loading = this.loadingCtrl.create();

    loading.present();

    this.conversationApi.confirmPayment(this.conversation.id).subscribe((response: Conversation) => {
      console.log(response);
      this.updateConversationStatus(response, 'PAYMENT_APROVAL_MSG');
      loading.dismiss();
    });
  }

  public rejectPaymentMark(): void {
    const loading = this.loadingCtrl.create();

    loading.present();

    this.conversationApi.rejectPaymentMark(this.conversation.id).subscribe((response: Conversation) => {
      console.log(response);
      this.updateConversationStatus(response, 'REJECT_PAYMENT_APROVAL_MSG');
      loading.dismiss();
    });
  }

  public markCommisionPaid(): void {
    const loading = this.loadingCtrl.create();

    loading.present();

    this.conversationApi.markCommisionPaid(this.conversation.id).subscribe((response: Conversation) => {
      console.log(response);
      this.updateConversationStatus(response, 'PENDING_COMMISSION_PAID_MSG');
      loading.dismiss();
    });
  }

  public confirmCommisionPaid(): void {
    const loading = this.loadingCtrl.create();

    loading.present();

    this.conversationApi.confirmCommisionPaid(this.conversation.id).subscribe((response: Conversation) => {
      console.log(response);
      this.updateConversationStatus(response, 'COMMISSION_PAID_MSG');
      loading.dismiss();
    });
  }

  public rejectCommisionPaid(): void {
    const loading = this.loadingCtrl.create();

    loading.present();

    this.conversationApi.rejectCommisionPaid(this.conversation.id).subscribe((response: Conversation) => {
      console.log(response);
      this.updateConversationStatus(response, 'REJECT_COMMISSION_PAID_MSG');
      loading.dismiss();
    });
  }  

  private getMessages(): void {
    const whereFilter: LoopBackFilter = {
      where: { 
        and: [
          { is_deleted: false }
        ] 
      }, 
      order: 'created_at ASC'
    };
    const loading = this.loadingCtrl.create();

    loading.present();

    this.conversationRef = this.rt.FireLoop.ref<Conversation>(Conversation);
    this.messageRef = this.conversationRef.make(this.conversation).child<Message>('messages');
    this.subscriptions.push( 
      this.messageRef.on('change', whereFilter).subscribe((messages: Message[]) => {
        loading.dismiss();

        this.messages = messages;
        this.messages.forEach((message: Message) => {
          if (!message.read_at && message.accountId !== this.me.accountId) {
            message.read_at = new Date();
            message.updated_at = new Date();
            message.updatedBy = this.me.accountId;

            const messageRefSub = this.messageRef.upsert(message).subscribe(
              () => {
                messageRefSub.unsubscribe();

                const conversationRefSub = this.conversationRef.upsert(this.conversation).subscribe(
                  () => {
                    conversationRefSub.unsubscribe();
                  });
              });
          }
        });

        console.log('last', messages[messages.length - 1])

        setTimeout(() => {
          console.log('getMessages', this.messages);
          this.scrollBottom();
        }, 10);
      })
    );
  }

  private buildMessage(message: string, media?: any): any { // type Message
    return {
      text: message,
      sent_at: new Date(),
      is_typing: false,
      is_deleted: false,
      is_media: false,
      created_at: new Date(),
      updated_at: new Date(),
      createdBy: this.me.accountId,
      updatedBy: this.me.accountId,
      accountId: this.me.accountId,
      conversationId: this.conversation.id,
    }
  }

  private buildSystemMessage(message: string, media?: any): any { // type Message
    return {
      text: message,
      sent_at: new Date(),
      read_at: new Date(),
      is_typing: false,
      is_deleted: false,
      is_media: false,
      created_at: new Date(),
      updated_at: new Date(),
      createdBy: -1,
      updatedBy: -1,
      accountId: this.me.accountId,
      conversationId: this.conversation.id,
    }
  }

  private scrollBottom(): void {
    const scrollHeight = this.chatContent.nativeElement.scrollHeight;

    this.chatContent.nativeElement.scroll(0, scrollHeight);
  }

  private updateConversationStatus(conversation: Conversation, changeStatusMsg: string): void {
    const loading = this.loadingCtrl.create();
    const messageObj = this.buildSystemMessage(changeStatusMsg);
    const messageRefSub = this.messageRef.upsert(messageObj).subscribe(() => {
      messageRefSub.unsubscribe();
      loading.dismiss();
    });

    loading.present();

    this.conversation.is_archived = conversation.is_archived;
    this.conversation.state = conversation.state;
    this.conversation.updated_at = conversation.updated_at;
    this.conversation.updatedBy = conversation.updatedBy;
    this.conversation.commision = conversation.commision;
    this.conversation.commisionAmount = conversation.commisionAmount;
    this.conversation.totalAmount = conversation.totalAmount;
  }
}
