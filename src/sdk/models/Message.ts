/* tslint:disable */
import {
  Account
} from '../index';

declare var Object: any;
export interface MessageInterface {
  "text": string;
  "sent_at"?: Date;
  "read_at"?: Date;
  "is_typing": boolean;
  "is_deleted": boolean;
  "is_media": boolean;
  "created_at": Date;
  "updated_at": Date;
  "createdBy": number;
  "updatedBy": number;
  "id"?: number;
  "accountId"?: number;
  "conversationId"?: number;
  account?: Account;
}

export class Message implements MessageInterface {
  "text": string;
  "sent_at": Date;
  "read_at": Date;
  "is_typing": boolean;
  "is_deleted": boolean;
  "is_media": boolean;
  "created_at": Date;
  "updated_at": Date;
  "createdBy": number;
  "updatedBy": number;
  "id": number;
  "accountId": number;
  "conversationId": number;
  account: Account;
  constructor(data?: MessageInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Message`.
   */
  public static getModelName() {
    return "Message";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Message for dynamic purposes.
  **/
  public static factory(data: MessageInterface): Message{
    return new Message(data);
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
      name: 'Message',
      plural: 'Messages',
      path: 'Messages',
      idName: 'id',
      properties: {
        "text": {
          name: 'text',
          type: 'string'
        },
        "sent_at": {
          name: 'sent_at',
          type: 'Date'
        },
        "read_at": {
          name: 'read_at',
          type: 'Date'
        },
        "is_typing": {
          name: 'is_typing',
          type: 'boolean',
          default: true
        },
        "is_deleted": {
          name: 'is_deleted',
          type: 'boolean',
          default: false
        },
        "is_media": {
          name: 'is_media',
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
        "accountId": {
          name: 'accountId',
          type: 'number'
        },
        "conversationId": {
          name: 'conversationId',
          type: 'number'
        },
      },
      relations: {
        account: {
          name: 'account',
          type: 'Account',
          model: 'Account',
          relationType: 'belongsTo',
                  keyFrom: 'accountId',
          keyTo: 'id'
        },
      }
    }
  }
}
