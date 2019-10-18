/* tslint:disable */

declare var Object: any;
export interface AccountInterface {
  "email"?: string;
  "passcode"?: string;
  "isTosRead": boolean;
  "account_verified": boolean;
  "realm"?: string;
  "username"?: string;
  "emailVerified"?: boolean;
  "id"?: number;
  "password"?: string;
  accessTokens?: any[];
  contact?: any;
  friends?: any[];
  planMapping?: any[];
  catalogs?: any[];
}

export class Account implements AccountInterface {
  "email": string;
  "passcode": string;
  "isTosRead": boolean;
  "account_verified": boolean;
  "realm": string;
  "username": string;
  "emailVerified": boolean;
  "id": number;
  "password": string;
  accessTokens: any[];
  contact: any;
  friends: any[];
  planMapping: any[];
  catalogs: any[];
  constructor(data?: AccountInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Account`.
   */
  public static getModelName() {
    return "Account";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Account for dynamic purposes.
  **/
  public static factory(data: AccountInterface): Account{
    return new Account(data);
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
      name: 'Account',
      plural: 'Accounts',
      path: 'Accounts',
      idName: 'id',
      properties: {
        "email": {
          name: 'email',
          type: 'string'
        },
        "passcode": {
          name: 'passcode',
          type: 'string'
        },
        "isTosRead": {
          name: 'isTosRead',
          type: 'boolean',
          default: false
        },
        "account_verified": {
          name: 'account_verified',
          type: 'boolean',
          default: false
        },
        "realm": {
          name: 'realm',
          type: 'string'
        },
        "username": {
          name: 'username',
          type: 'string'
        },
        "emailVerified": {
          name: 'emailVerified',
          type: 'boolean'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "password": {
          name: 'password',
          type: 'string'
        },
      },
      relations: {
        accessTokens: {
          name: 'accessTokens',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'userId'
        },
        contact: {
          name: 'contact',
          type: 'any',
          model: '',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'accountId'
        },
        friends: {
          name: 'friends',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
          modelThrough: 'Friend',
          keyThrough: 'friendId',
          keyFrom: 'id',
          keyTo: 'contactId'
        },
        planMapping: {
          name: 'planMapping',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'accountId'
        },
        catalogs: {
          name: 'catalogs',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'accountId'
        },
      }
    }
  }
}
