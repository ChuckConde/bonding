import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { NavParams, Events } from 'ionic-angular';
import { Conversation, Contact } from '../../../sdk';
import { CommonProvider } from '../../../providers/common/common';

@Component({
  selector: 'proposal-details',
  templateUrl: 'proposal-details.html'
})
export class ProposalDetailsComponent {
  public conversation: Conversation;
  public isAgent: boolean = true;
  public role: any;
  public contact: Contact;
  
  constructor(
    public navParams: NavParams,
    public commonProvider: CommonProvider,
    public viewCtrl: ViewController,
    private events: Events
  ) { }

  ngOnInit() {
    this.role = this.commonProvider.role;
    this.contact = this.commonProvider.contact;
    this.isAgent = this.role.name === 'agent';    
    this.conversation = this.navParams.get('data');

    if (typeof this.conversation.orderData.products === 'string') {
      this.conversation.orderData.products = JSON.parse(this.conversation.orderData.products);
    }

    console.log(this.conversation)
  }

  public close() {
    this.viewCtrl.dismiss();
  }

  public cancelProposal(): void {
    this.events.publish('cancelProposal');
    this.close();
  }

  public sendInvoice(): void {
    this.events.publish('sendInvoice');
    this.close();
  }

  public cancelProposalByDelivered(): void {
    this.events.publish('cancelProposalByDelivered');
    this.close();
  }

  public markAsDelivered(): void {
    this.events.publish('markAsDelivered');
    this.close();
  }

  public rejectDeliveredMark(): void {
    this.events.publish('rejectDeliveredMark');
    this.close();
  }

  public confirmDelivered(): void {
    this.events.publish('confirmDelivered');
    this.close();
  }

  public markAsPaid(): void {
    this.events.publish('markAsPaid');
    this.close();
  }

  public confirmPayment(): void {
    this.events.publish('confirmPayment');
    this.close();
  }

  public rejectPaymentMark(): void {
    this.events.publish('rejectPaymentMark');
    this.close();
  }

  public markCommisionPaid(): void {
    this.events.publish('markCommisionPaid');
    this.close();
  }

  public confirmCommisionPaid(): void {
    this.events.publish('confirmCommisionPaid');
    this.close();
  }

  public rejectCommisionPaid(): void {
    this.events.publish('rejectCommisionPaid');
    this.close();
  }  
}
