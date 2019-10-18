import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, Events } from 'ionic-angular';
import { Contact, ConversationApi, Conversation, FireLoopRef, RealTime, ContactApi, LoopBackFilter, Message } from '../../sdk';
import { CommonProvider } from '../../providers/common/common';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { ProposalContacts } from './proposal-contacts/proposal-contacts';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { ProposalPage } from '../proposal/proposal';
import { Subscription } from 'rxjs';

/**
 * Generated class for the ProposalsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export interface ConversationExtended extends Conversation {
  unreadedMessages: boolean;
  unreadedMessagesAmount: number;
}

@IonicPage()
@Component({
  selector: 'page-proposals',
  templateUrl: 'proposals.html',
})
export class ProposalsPage {
	public activeTab: string; // ACTIVE, FINALIZED
	public role: any;
	public me: Contact;
	public isAgent: boolean = true;
  public unreadedConversations: number;

  public loading: Loading;
  public loadingFlag: boolean = true; 

  public activeConversations: ConversationExtended[] = [];
  public deletedConversations: ConversationExtended[] = [];
  public reference: FireLoopRef<Conversation>;

  private subscriptions: Subscription[] = [];

  constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public loadingCtrl: LoadingController,
		public commonProvider: CommonProvider,
		public modalCtrl: ModalController,
    public rt: RealTime,
		public conversationApi: ConversationApi,
		public actionSheetCtrl: ActionSheetController,
    public contactApi: ContactApi,
    public events: Events
	) {	}

  ngOnInit() {
		this.me = this.commonProvider.contact;
		this.role = this.commonProvider.role;
		this.isAgent = this.role.name === 'agent';
    
    // this.rt.onDisconnect
    if (this.rt.connection.isConnected() && this.rt.connection.authenticated) {
      this.subscriptions.push(
        this.rt.onReady().subscribe(() => this.setActiveTab('ACTIVE'))
      );
    } else {
      this.subscriptions.push(
        this.rt.onAuthenticated().subscribe(() => this.setActiveTab('ACTIVE')),
        this.rt.onReady().subscribe()
      );
    }
  }
  
  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

	public setActiveTab(tab): void {
    const loading = this.loadingCtrl.create();
    loading.present();

    this.activeTab = tab;
    this.loadingFlag = true;

    if (this.activeTab === 'ACTIVE') {
      this.getActiveProposals(loading);
    } else {
      this.getFinalizedProposals(loading);
    }
  }
  
  public openContacts(): void {
    if (!this.isAgent) {
      return;
    }
    
    const modal = this.modalCtrl.create(ProposalContacts);
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        this.navCtrl.push(ProposalPage, {
          company: data.contact
        });
      }
    });
  }

  public openChat(conversation: Conversation): void {
    this.navCtrl.push(ProposalPage, {
      conversation: conversation
    });
  }

  private getActiveProposals(loading: Loading): void {        
    const whereFilter: LoopBackFilter = {
      where: {
        and: [
          {
            or: [
              { agentId: this.me.id },
              { companyId: this.me.id },
            ]
          },
          {
            is_deleted: false,
            is_archived: false
          }
        ]
      },
      order: 'updated_at DESC',
      include: [
        {
          relation: 'agentClient',
          scope: {
            where: { is_deleted: false },
            include: ['province', 'city']
          }
        },
        {
          relation: 'deliveryConditions',
          scope: {
            where: { is_deleted: false },
            include: ['province', 'city']
          }
        },
        {
          relation: 'orderData',
          scope: {
            where: { is_deleted: false }
          }
        },
        {
          relation: 'agent',
          scope: {
            where: { is_deleted: false },
            include: ['contact']
          }
        },
        {
          relation: 'company',
          scope: {
            where: { is_deleted: false },
            include: ['contact']
          }
        },
        {
          relation: 'messages',
          scope: {
            where: { 
              is_deleted: false 
            },
            order: 'created_at DESC',
            limit: 10
          }
        }
      ]
    };

    this.reference = this.rt.FireLoop.ref<Conversation>(Conversation);
    this.reference.on('change', whereFilter).subscribe(
      (conversations: Array<Conversation>) => {
        this.unreadedConversations = 0;
        this.activeConversations = conversations.map((conversation: Conversation) => {
          let unreadedMessages = false;
          let unreadedMessagesAmount = 0;

          conversation.messages.forEach((message: Message) => {
            if (!message.read_at && message.accountId !== this.me.accountId) {
              unreadedMessagesAmount++;
            }
          });

          if (unreadedMessagesAmount) {
            unreadedMessages = true;
            this.unreadedConversations++;
          }

          return Object.assign(conversation, {
            unreadedMessages: unreadedMessages,
            unreadedMessagesAmount: unreadedMessagesAmount
          });
        });

        this.loadingFlag = false;
        loading.dismissAll();
        this.events.publish('activeConversationsChange', this.activeConversations);
      });
  }

  private getFinalizedProposals(loading: Loading): void {
    const whereFilter: LoopBackFilter = {
      where: {
        and: [
          {
            or: [
              { agentId: this.me.id },
              { companyId: this.me.id },
            ]
          },
          {
            is_deleted: false,
            is_archived: true
          }
        ]
      },
      order: 'updated_at DESC',
      include: [
        {
          relation: 'agentClient',
          scope: {
            where: { is_deleted: false },
            include: ['province', 'city']
          }
        },
        {
          relation: 'deliveryConditions',
          scope: {
            where: { is_deleted: false },
            include: ['province', 'city']
          }
        },
        {
          relation: 'orderData',
          scope: {
            where: { is_deleted: false }
          }
        },
        {
          relation: 'agent',
          scope: {
            where: { is_deleted: false },
            include: ['contact']
          }
        },
        {
          relation: 'company',
          scope: {
            where: { is_deleted: false },
            include: ['contact']
          }
        },
        {
          relation: 'messages',
          scope: {
            where: { 
              is_deleted: false 
            },
            order: 'created_at DESC',
            limit: 10
          }
        }
      ]
    };

    this.reference = this.rt.FireLoop.ref<Conversation>(Conversation);
    this.reference.on('change', whereFilter).subscribe(
      (conversations: Array<Conversation>) => {
        this.deletedConversations = conversations.map((conversation: Conversation) => {
          return Object.assign(conversation, {
            unreadedMessages: false,
            unreadedMessagesAmount: 0
          });
        });
        
        loading.dismissAll();
        this.loadingFlag = false;
        console.log(this.deletedConversations)
      });
  }
}

  // 	public expandItem(item){

// 		this.conversations.map((listItem) => {

// 				if(item == listItem){
// 					if(listItem.expanded !== undefined){
// 						listItem.expanded = !listItem.expanded;
// 					}
// 					else{
// 						listItem.expanded = true;
// 					}	
// 				} else {
// 						listItem.expanded = false;
// 				}

// 				return listItem;

// 		});

// }
		// if (this.activeTab === 'ACTIVE') {
		// 	this.reference = this.rt.FireLoop.ref<Conversation>(Conversation);
		// 	this.loading = this.loadingCtrl.create();
		// 	this.loading.present();

		// 	this.reference.on('change', {
		// 		where: {
		// 			or: [
		// 				{
		// 					and: [
		// 						{ is_archived: false }, 
		// 						{ is_deleted: false }, 
		// 						{ senderId: this.me.id },
		// 					]
		// 				},
		// 				{
		// 					and: [
		// 						{ is_archived: false }, 
		// 						{ is_deleted: false }, 
		// 						{ recipientId: this.me.id }
		// 					]
		// 				}]
		// 		},
		// 		include: ['sender', 'recipient', 'messages', 'orders']
		// 	}).subscribe((messages: any) => {
		// 		// this.loading = false;
		// 		this.getConversations(messages);
		// 		this.loading.dismissAll();
		// 	})
		// } else {
		// 	this.reference = this.rt.FireLoop.ref<Conversation>(Conversation);
		// 	this.loading = this.loadingCtrl.create();
		// 	this.loading.present();

		// 	this.reference.on('change', {
		// 		where: {
		// 			or: [
		// 				{
		// 					and: [
		// 						{ is_archived: true }, 
		// 						{ is_deleted: false }, 
		// 						{ senderId: this.me.id },
		// 					]
		// 				},
		// 				{
		// 					and: [
		// 						{ is_archived: true }, 
		// 						{ is_deleted: false }, 
		// 						{ recipientId: this.me.id }
		// 					]
		// 				}]
		// 		},
		// 		include: ['sender', 'recipient', 'messages', 'orders']
		// 	}).subscribe((messages: Conversation[]) => {
		// 		// this.loading = false;
		// 		this.getConversations(messages);
		// 		this.loading.dismissAll();
		// 	});
		// }


	// public openContacts(): void {
	// 	const modal = this.modalCtrl.create(OrderFormComponent);

	// 	modal.present();
	// 	modal.onDidDismiss((data) => {
	// 		if (data) {
	// 			if (data.route === 'profile')
	// 				this.openProfile(data.data);
				
	// 			if (data.route === 'chat')
	// 				this.iniProposal(data.data);
	// 		}
	// 	});
	// }

	// public openProfile(contact: Contact): void {
	// 	this.navCtrl.push(ProfilePage, {
	// 		data: contact
	// 	});
	// }

	// public iniProposal(contact: Contact): void {
	// 	const modal = this.modalCtrl.create(OrderFormComponent);

	// 	modal.present();
	// 	modal.onDidDismiss((data) => {
	// 		// @TODO: Guardar datos del form de pedido en DB
	// 		this.initProposalChat(contact, data);
	// 	});
	// }

	// public getConversations(conversations) {
  //   this.conversations = this.conversationsBackUp = conversations.map((convo) => {
  //     return {
  //       title: convo.recipientId !== this.me.id? 
	// 			(this.isAgent? 
	// 				convo.recipient.othernames :
	// 				convo.recipient.firstname + ' ' + convo.recipient.lastname
	// 			) :
	// 			(this.isAgent? 
	// 				convo.sender.othernames :
	// 				convo.sender.firstname + ' ' + convo.sender.lastname
	// 			),
  //       subtitle: convo.messages.length > 0 ? convo.messages[convo.messages.length - 1].text : 'start chatting',
  //       picture: convo.recipientId !== this.me.id ? convo.recipient.picture : convo.sender.picture,
  //       data: [convo]
  //     };
	// 	});
	// 	let finalConversations = [];
	// 	let convoFlag = false;
	// 	this.conversations.forEach(convo =>{
	// 		if (finalConversations.length === 0) {
	// 			finalConversations.push(convo)
	// 		} else {
	// 			finalConversations.forEach(item => {
	// 				if (item.title === convo.title) {
	// 					item.data.push(convo.data);
	// 					convoFlag = true;
	// 				}
	// 			})
	// 				if (!convoFlag) {
	// 					finalConversations.push(convo);
	// 				}
	// 				convoFlag = false;
	// 		}
	// 	});
	// 	this.conversations = finalConversations;
	// 	console.log(this.conversations);
  // }

	// public initProposalChat(contact: Contact, orderForm: any): void {
	// 	console.log('orderFrom', orderForm, 'contact', contact);
	// 	const conversation: any = {
  //     senderId: this.me.id,
  //     recipientId: contact.id,
  //     created_by: this.me.id,
  //     updated_by: this.me.id,
  //     is_archived: false,
  //     created_at: new Date(),
  //     is_active: true,
  //     is_deleted: false,
	// 		updated_at: new Date()
	// 	};
		
  //   this.conversationApi.findOne({
  //     where: {
  //       or: [
  //         {
  //           and: [
	// 						{ is_archived: false }, 
	// 						{ is_deleted: false }, 
	// 						{ senderId: conversation.senderId },
	// 						{ recipientId: conversation.recipientId }
	// 					]
  //         },
  //         {
  //           and: [
	// 						{ is_archived: false }, 
	// 						{ is_deleted: false }, 
	// 						{ senderId: conversation.recipientId },
	// 						{ recipientId: conversation.senderId }
	// 					]
  //         }]
  //     }, include: ['sender', 'recipient', 'messages', 'orders']
  //   }).subscribe(
  //     (found_conversation: Conversation) => {
	// 			// if conversation has been found
	// 			if(found_conversation.orders.length > 0){
	// 				this.navCtrl.push(ChatMessage, found_conversation);
	// 			} else {
	// 				this.navCtrl.push(OrderFormComponent, found_conversation);
	// 			}
        
  //     }, (error) => {
  //       // if conversation hasnt been found create one with sender and recipient details
  //       this.conversationApi.create(conversation as Conversation).subscribe((created_conversation: Conversation) => {
  //         this.conversationApi.findOne({
  //           where: {
  //             and: [
	// 							{ is_archived: false }, 
	// 							{ is_deleted: false }, 
	// 							{ id: created_conversation.id },
	// 							{ recipientId: created_conversation.recipientId }
	// 						]
  //           }, include: ['sender', 'recipient', 'messages', 'orders']
  //         }).subscribe(
  //           (found_conversation_after_creation) => {
  //             // get conversation context and send it to chat page
  //             if (found_conversation_after_creation) {
  //               this.navCtrl.push(ChatMessage, found_conversation_after_creation);
  //             }
  //           });
  //       });
  //     });
	// }

	// public openMessage(conversation: Conversation): void {
	// 	console.log(conversation);
	// 	if(conversation !== undefined){ // conversation.length ?? 
	// 		if(conversation[0].messages){
	// 			if(conversation[0].orders.length > 0){
	// 				this.navCtrl.push(ChatMessage, conversation[0]);
	// 				} else {
	// 				this.navCtrl.push(OrderFormComponent, conversation[0]);
	// 				}
	// 		} else {
	// 			this.navCtrl.push(OrderFormComponent, conversation[0])
	// 		}
	// 	} else {
	// 		if(conversation.messages){
	// 			if(conversation.orders.length > 0){
	// 				this.navCtrl.push(ChatMessage, conversation);
	// 				} else {
	// 				this.navCtrl.push(OrderFormComponent, conversation);
	// 				}
	// 		} else {
	// 			this.navCtrl.push(OrderFormComponent, conversation)
	// 		}
	// 	}
		
	// }


