/* tslint:disable */
import {
  Account
} from '../index';

declare var Object: any;
export interface FilesInterface {
  "container": string;
  "name": string;
  "originalName": string;
  "type": string;
  "size": number;
  "is_deleted": boolean;
  "createdBy": number;
  "updatedBy": number;
  "created_at": Date;
  "updated_at": Date;
  "id"?: number;
  "accountId"?: number;
  account?: Account;
}

export class Files implements FilesInterface {
  "container": string;
  "name": string;
  "originalName": string;
  "type": string;
  "size": number;
  "is_deleted": boolean;
  "createdBy": number;
  "updatedBy": number;
  "created_at": Date;
  "updated_at": Date;
  "id": number;
  "accountId": number;
  account: Account;
  constructor(data?: FilesInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Files`.
   */
  public static getModelName() {
    return "Files";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Files for dynamic purposes.
  **/
  public static factory(data: FilesInterface): Files{
    return new Files(data);
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
      name: 'Files',
      plural: 'Files',
      path: 'Files',
      idName: 'id',
      properties: {
        "container": {
          name: 'container',
          type: 'string'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "originalName": {
          name: 'originalName',
          type: 'string'
        },
        "type": {
          name: 'type',
          type: 'string'
        },
        "size": {
          name: 'size',
          type: 'number'
        },
        "is_deleted": {
          name: 'is_deleted',
          type: 'boolean',
          default: false
        },
        "createdBy": {
          name: 'createdBy',
          type: 'number'
        },
        "updatedBy": {
          name: 'updatedBy',
          type: 'number'
        },
        "created_at": {
          name: 'created_at',
          type: 'Date'
        },
        "updated_at": {
          name: 'updated_at',
          type: 'Date'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "accountId": {
          name: 'accountId',
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
