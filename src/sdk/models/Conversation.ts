/* tslint:disable */
import {
  Message,
  Order,
  ConversationCalification,
  Files
} from '../index';

declare var Object: any;
export interface ConversationInterface {
  "state"?: string;
  "commision": number;
  "commisionAmount"?: number;
  "totalAmount"?: number;
  "is_archived": boolean;
  "is_deleted": boolean;
  "created_at": Date;
  "updated_at": Date;
  "createdBy": number;
  "updatedBy": number;
  "id"?: number;
  "agentId"?: number;
  "companyId"?: number;
  "invoiceId"?: number;
  agent?: any;
  company?: any;
  messages?: Message[];
  orderData?: Order;
  agentClient?: any;
  deliveryConditions?: any;
  conversationCalification?: ConversationCalification;
  invoice?: Files;
}

export class Conversation implements ConversationInterface {
  "state": string;
  "commision": number;
  "commisionAmount": number;
  "totalAmount": number;
  "is_archived": boolean;
  "is_deleted": boolean;
  "created_at": Date;
  "updated_at": Date;
  "createdBy": number;
  "updatedBy": number;
  "id": number;
  "agentId": number;
  "companyId": number;
  "invoiceId": number;
  agent: any;
  company: any;
  messages: Message[];
  orderData: Order;
  agentClient: any;
  deliveryConditions: any;
  conversationCalification: ConversationCalification;
  invoice: Files;
  constructor(data?: ConversationInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Conversation`.
   */
  public static getModelName() {
    return "Conversation";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Conversation for dynamic purposes.
  **/
  public static factory(data: ConversationInterface): Conversation{
    return new Conversation(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'Conversation',
      plural: 'Conversations',
      path: 'Conversations',
      idName: 'id',
      properties: {
        "state": {
          name: 'state',
          type: 'string'
        },
        "commision": {
          name: 'commision',
          type: 'number'
        },
        "commisionAmount": {
          name: 'commisionAmount',
          type: 'number'
        },
        "totalAmount": {
          name: 'totalAmount',
          type: 'number'
        },
        "is_archived": {
          name: 'is_archived',
          type: 'boolean',
          default: false
        },
        "is_deleted": {
          name: 'is_deleted',
          type: 'boolean',
          default: false
        },
        "created_at": {
          name: 'created_at',
          type: 'Date'
        },
        "updated_at": {
          name: 'updated_at',
          type: 'Date'
        },
        "createdBy": {
          name: 'createdBy',
          type: 'number'
        },
        "updatedBy": {
          name: 'updatedBy',
          type: 'number'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "agentId": {
          name: 'agentId',
          type: 'number'
        },
        "companyId": {
          name: 'companyId',
          type: 'number'
        },
        "invoiceId": {
          name: 'invoiceId',
          type: 'number'
        },
      },
      relations: {
        agent: {
          name: 'agent',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'agentId',
          keyTo: 'id'
        },
        company: {
          name: 'company',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'companyId',
          keyTo: 'id'
        },
        messages: {
          name: 'messages',
          type: 'Message[]',
          model: 'Message',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'conversationId'
        },
        orderData: {
          name: 'orderData',
          type: 'Order',
          model: 'Order',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'conversationId'
        },
        agentClient: {
          name: 'agentClient',
          type: 'any',
          model: '',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'conversationId'
        },
        deliveryConditions: {
          name: 'deliveryConditions',
          type: 'any',
          model: '',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'conversationId'
        },
        conversationCalification: {
          name: 'conversationCalification',
          type: 'ConversationCalification',
          model: 'ConversationCalification',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'conversationId'
        },
        invoice: {
          name: 'invoice',
          type: 'Files',
          model: 'Files',
          relationType: 'belongsTo',
                  keyFrom: 'invoiceId',
          keyTo: 'id'
        },
      }
    }
  }
}
