/* tslint:disable */
import {
  Account,
  Conversation
} from '../index';

declare var Object: any;
export interface ConversationCalificationInterface {
  "rate"?: number;
  "comments"?: string;
  "is_deleted": boolean;
  "created_at": Date;
  "updated_at": Date;
  "createdBy": number;
  "updatedBy": number;
  "id"?: number;
  "agentId"?: number;
  "companyId"?: number;
  "conversationId"?: number;
  agent?: Account;
  company?: Account;
  conversation?: Conversation;
}

export class ConversationCalification implements ConversationCalificationInterface {
  "rate": number;
  "comments": string;
  "is_deleted": boolean;
  "created_at": Date;
  "updated_at": Date;
  "createdBy": number;
  "updatedBy": number;
  "id": number;
  "agentId": number;
  "companyId": number;
  "conversationId": number;
  agent: Account;
  company: Account;
  conversation: Conversation;
  constructor(data?: ConversationCalificationInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ConversationCalification`.
   */
  public static getModelName() {
    return "ConversationCalification";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ConversationCalification for dynamic purposes.
  **/
  public static factory(data: ConversationCalificationInterface): ConversationCalification{
    return new ConversationCalification(data);
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
      name: 'ConversationCalification',
      plural: 'ConversationCalifications',
      path: 'ConversationCalifications',
      idName: 'id',
      properties: {
        "rate": {
          name: 'rate',
          type: 'number'
        },
        "comments": {
          name: 'comments',
          type: 'string'
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
        "conversationId": {
          name: 'conversationId',
          type: 'number'
        },
      },
      relations: {
        agent: {
          name: 'agent',
          type: 'Account',
          model: 'Account',
          relationType: 'belongsTo',
                  keyFrom: 'agentId',
          keyTo: 'id'
        },
        company: {
          name: 'company',
          type: 'Account',
          model: 'Account',
          relationType: 'belongsTo',
                  keyFrom: 'companyId',
          keyTo: 'id'
        },
        conversation: {
          name: 'conversation',
          type: 'Conversation',
          model: 'Conversation',
          relationType: 'belongsTo',
                  keyFrom: 'conversationId',
          keyTo: 'id'
        },
      }
    }
  }
}
