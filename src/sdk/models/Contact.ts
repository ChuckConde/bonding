/* tslint:disable */

declare var Object: any;
export interface ContactInterface {
  "firstname"?: string;
  "lastname"?: string;
  "othernames"?: string;
  "description"?: string;
  "picture"?: string;
  "gender"?: string;
  "email"?: string;
  "phone"?: string;
  "wtComplete"?: boolean;
  "dateOfBirth"?: Date;
  "is_deleted": boolean;
  "created_at": Date;
  "updated_at": Date;
  "createdBy": number;
  "updatedBy": number;
  "id"?: number;
  "accountId"?: number;
  "locationId"?: number;
  account?: any;
  friends?: any[];
  location?: any;
  professionalPreferences?: any;
}

export class Contact implements ContactInterface {
  "firstname": string;
  "lastname": string;
  "othernames": string;
  "description": string;
  "picture": string;
  "gender": string;
  "email": string;
  "phone": string;
  "wtComplete": boolean;
  "dateOfBirth": Date;
  "is_deleted": boolean;
  "created_at": Date;
  "updated_at": Date;
  "createdBy": number;
  "updatedBy": number;
  "id": number;
  "accountId": number;
  "locationId": number;
  account: any;
  friends: any[];
  location: any;
  professionalPreferences: any;
  constructor(data?: ContactInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Contact`.
   */
  public static getModelName() {
    return "Contact";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Contact for dynamic purposes.
  **/
  public static factory(data: ContactInterface): Contact{
    return new Contact(data);
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
      name: 'Contact',
      plural: 'Contacts',
      path: 'Contacts',
      idName: 'id',
      properties: {
        "firstname": {
          name: 'firstname',
          type: 'string'
        },
        "lastname": {
          name: 'lastname',
          type: 'string'
        },
        "othernames": {
          name: 'othernames',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "picture": {
          name: 'picture',
          type: 'string'
        },
        "gender": {
          name: 'gender',
          type: 'string'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "phone": {
          name: 'phone',
          type: 'string'
        },
        "wtComplete": {
          name: 'wtComplete',
          type: 'boolean',
          default: false
        },
        "dateOfBirth": {
          name: 'dateOfBirth',
          type: 'Date'
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
        "locationId": {
          name: 'locationId',
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
        location: {
          name: 'location',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'locationId',
          keyTo: 'id'
        },
        professionalPreferences: {
          name: 'professionalPreferences',
          type: 'any',
          model: '',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'contactId'
        },
      }
    }
  }
}
