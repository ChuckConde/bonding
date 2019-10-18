/* tslint:disable */

declare var Object: any;
export interface LocationInterface {
  "adress"?: string;
  "is_deleted": boolean;
  "created_at": Date;
  "updated_at": Date;
  "createdBy": number;
  "updatedBy": number;
  "id"?: number;
  "accountId"?: number;
  "cityId"?: number;
  "provinceId"?: number;
  "countryId"?: number;
  contact?: any;
  account?: any;
  city?: any;
  province?: any;
  country?: any;
}

export class Location implements LocationInterface {
  "adress": string;
  "is_deleted": boolean;
  "created_at": Date;
  "updated_at": Date;
  "createdBy": number;
  "updatedBy": number;
  "id": number;
  "accountId": number;
  "cityId": number;
  "provinceId": number;
  "countryId": number;
  contact: any;
  account: any;
  city: any;
  province: any;
  country: any;
  constructor(data?: LocationInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Location`.
   */
  public static getModelName() {
    return "Location";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Location for dynamic purposes.
  **/
  public static factory(data: LocationInterface): Location{
    return new Location(data);
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
      name: 'Location',
      plural: 'Locations',
      path: 'Locations',
      idName: 'id',
      properties: {
        "adress": {
          name: 'adress',
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
        "cityId": {
          name: 'cityId',
          type: 'number'
        },
        "provinceId": {
          name: 'provinceId',
          type: 'number'
        },
        "countryId": {
          name: 'countryId',
          type: 'number'
        },
      },
      relations: {
        contact: {
          name: 'contact',
          type: 'any',
          model: '',
          relationType: 'hasOne',
                  keyFrom: 'id',
          keyTo: 'locationId'
        },
        account: {
          name: 'account',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'accountId',
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
        country: {
          name: 'country',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'countryId',
          keyTo: 'id'
        },
      }
    }
  }
}
