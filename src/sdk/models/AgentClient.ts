/* tslint:disable */

declare var Object: any;
export interface AgentClientInterface {
  "cuit": string;
  "invoiceConditions": string;
  "adress": string;
  "phone": string;
  "email": string;
  "contactName": string;
  "postalCode": string;
  "segment": string;
  "is_deleted": boolean;
  "created_at": Date;
  "updated_at": Date;
  "createdBy": number;
  "updatedBy": number;
  "id"?: number;
  "accountId"?: number;
  "conversationId"?: number;
  "cityId"?: number;
  "provinceId"?: number;
  account?: any;
  conversation?: any;
  city?: any;
  province?: any;
}

export class AgentClient implements AgentClientInterface {
  "cuit": string;
  "invoiceConditions": string;
  "adress": string;
  "phone": string;
  "email": string;
  "contactName": string;
  "postalCode": string;
  "segment": string;
  "is_deleted": boolean;
  "created_at": Date;
  "updated_at": Date;
  "createdBy": number;
  "updatedBy": number;
  "id": number;
  "accountId": number;
  "conversationId": number;
  "cityId": number;
  "provinceId": number;
  account: any;
  conversation: any;
  city: any;
  province: any;
  constructor(data?: AgentClientInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `AgentClient`.
   */
  public static getModelName() {
    return "AgentClient";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of AgentClient for dynamic purposes.
  **/
  public static factory(data: AgentClientInterface): AgentClient{
    return new AgentClient(data);
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
      name: 'AgentClient',
      plural: 'AgentClients',
      path: 'AgentClients',
      idName: 'id',
      properties: {
        "cuit": {
          name: 'cuit',
          type: 'string'
        },
        "invoiceConditions": {
          name: 'invoiceConditions',
          type: 'string'
        },
        "adress": {
          name: 'adress',
          type: 'string'
        },
        "phone": {
          name: 'phone',
          type: 'string'
        },
        "email": {
          name: 'email',
          type: 'string'
        },
        "contactName": {
          name: 'contactName',
          type: 'string'
        },
        "postalCode": {
          name: 'postalCode',
          type: 'string'
        },
        "segment": {
          name: 'segment',
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
        "accountId": {
          name: 'accountId',
          type: 'number'
        },
        "conversationId": {
          name: 'conversationId',
          type: 'number'
        },
        "cityId": {
          name: 'cityId',
          type: 'number'
        },
        "provinceId": {
          name: 'provinceId',
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
        conversation: {
          name: 'conversation',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'conversationId',
          keyTo: 'id'
        },
        city: {
          name: 'city',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'cityId',
          keyTo: 'id'
        },
        province: {
          name: 'province',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'provinceId',
          keyTo: 'id'
        },
      }
    }
  }
}
