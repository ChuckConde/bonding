/* tslint:disable */

declare var Object: any;
export interface FriendInterface {
  "accept": boolean;
  "pendingAccept": boolean;
  "pendingLimit": boolean;
  "is_deleted": boolean;
  "created_at": Date;
  "updated_at": Date;
  "createdBy": number;
  "updatedBy": number;
  "id"?: number;
  "accountId"?: number;
  "linkedId"?: number;
  account?: any;
  linked?: any;
}

export class Friend implements FriendInterface {
  "accept": boolean;
  "pendingAccept": boolean;
  "pendingLimit": boolean;
  "is_deleted": boolean;
  "created_at": Date;
  "updated_at": Date;
  "createdBy": number;
  "updatedBy": number;
  "id": number;
  "accountId": number;
  "linkedId": number;
  account: any;
  linked: any;
  constructor(data?: FriendInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Friend`.
   */
  public static getModelName() {
    return "Friend";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Friend for dynamic purposes.
  **/
  public static factory(data: FriendInterface): Friend{
    return new Friend(data);
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
      name: 'Friend',
      plural: 'Friends',
      path: 'Friends',
      idName: 'id',
      properties: {
        "accept": {
          name: 'accept',
          type: 'boolean',
          default: false
        },
        "pendingAccept": {
          name: 'pendingAccept',
          type: 'boolean',
          default: true
        },
        "pendingLimit": {
          name: 'pendingLimit',
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
        "accountId": {
          name: 'accountId',
          type: 'number'
        },
        "linkedId": {
          name: 'linkedId',
          type: 'number'
        },
      },
      relations: {
        account: {
          name: 'account',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'accountId',
          keyTo: 'id'
        },
        linked: {
          name: 'linked',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'linkedId',
          keyTo: 'id'
        },
      }
    }
  }
}
