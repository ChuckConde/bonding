/* tslint:disable */

declare var Object: any;
export interface DeliveryConditionsInterface {
  "deliveryAdress": string;
  "postalCode": string;
  "days": Array<any>;
  "startTime": string;
  "endTime": string;
  "paymentMethod": string;
  "comments"?: string;
  "is_deleted": boolean;
  "created_at": Date;
  "updated_at": Date;
  "createdBy": number;
  "updatedBy": number;
  "id"?: number;
  "cityId"?: number;
  "provinceId"?: number;
  "conversationId"?: number;
  city?: any;
  province?: any;
  conversation?: any;
}

export class DeliveryConditions implements DeliveryConditionsInterface {
  "deliveryAdress": string;
  "postalCode": string;
  "days": Array<any>;
  "startTime": string;
  "endTime": string;
  "paymentMethod": string;
  "comments": string;
  "is_deleted": boolean;
  "created_at": Date;
  "updated_at": Date;
  "createdBy": number;
  "updatedBy": number;
  "id": number;
  "cityId": number;
  "provinceId": number;
  "conversationId": number;
  city: any;
  province: any;
  conversation: any;
  constructor(data?: DeliveryConditionsInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `DeliveryConditions`.
   */
  public static getModelName() {
    return "DeliveryConditions";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of DeliveryConditions for dynamic purposes.
  **/
  public static factory(data: DeliveryConditionsInterface): DeliveryConditions{
    return new DeliveryConditions(data);
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
      name: 'DeliveryConditions',
      plural: 'DeliveryConditions',
      path: 'DeliveryConditions',
      idName: 'id',
      properties: {
        "deliveryAdress": {
          name: 'deliveryAdress',
          type: 'string'
        },
        "postalCode": {
          name: 'postalCode',
          type: 'string'
        },
        "days": {
          name: 'days',
          type: 'Array&lt;any&gt;'
        },
        "startTime": {
          name: 'startTime',
          type: 'string'
        },
        "endTime": {
          name: 'endTime',
          type: 'string'
        },
        "paymentMethod": {
          name: 'paymentMethod',
          type: 'string'
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
        "cityId": {
          name: 'cityId',
          type: 'number'
        },
        "provinceId": {
          name: 'provinceId',
          type: 'number'
        },
        "conversationId": {
          name: 'conversationId',
          type: 'number'
        },
      },
      relations: {
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
        conversation: {
          name: 'conversation',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'conversationId',
          keyTo: 'id'
        },
      }
    }
  }
}
