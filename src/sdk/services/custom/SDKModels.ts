/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { Account } from '../../models/Account';
import { Contact } from '../../models/Contact';
import { Friend } from '../../models/Friend';
import { Conversation } from '../../models/Conversation';
import { Message } from '../../models/Message';
import { Country } from '../../models/Country';
import { Province } from '../../models/Province';
import { City } from '../../models/City';
import { Location } from '../../models/Location';
import { ProfessionalPreferences } from '../../models/ProfessionalPreferences';
import { Zone } from '../../models/Zone';
import { Order } from '../../models/Order';
import { AgentClient } from '../../models/AgentClient';
import { DeliveryConditions } from '../../models/DeliveryConditions';
import { ConversationCalification } from '../../models/ConversationCalification';
import { Files } from '../../models/Files';
import { Container } from '../../models/Container';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    User: User,
    Account: Account,
    Contact: Contact,
    Friend: Friend,
    Conversation: Conversation,
    Message: Message,
    Country: Country,
    Province: Province,
    City: City,
    Location: Location,
    ProfessionalPreferences: ProfessionalPreferences,
    Zone: Zone,
    Order: Order,
    AgentClient: AgentClient,
    DeliveryConditions: DeliveryConditions,
    ConversationCalification: ConversationCalification,
    Files: Files,
    Container: Container,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }

  public getAll(): Models {
    return this.models;
  }

  public getModelNames(): string[] {
    return Object.keys(this.models);
  }
}
