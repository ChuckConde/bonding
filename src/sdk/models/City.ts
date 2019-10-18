/* tslint:disable */
import {
  Province
} from '../index';

declare var Object: any;
export interface CityInterface {
  "printable_name": string;
  "postal_code": string;
  "city_code": string;
  "geolocation": any;
  "id"?: number;
  "provinceId"?: number;
  province?: Province;
  location?: any[];
}

export class City implements CityInterface {
  "printable_name": string;
  "postal_code": string;
  "city_code": string;
  "geolocation": any;
  "id": number;
  "provinceId": number;
  province: Province;
  location: any[];
  constructor(data?: CityInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `City`.
   */
  public static getModelName() {
    return "City";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of City for dynamic purposes.
  **/
  public static factory(data: CityInterface): City{
    return new City(data);
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
      name: 'City',
      plural: 'Cities',
      path: 'Cities',
      idName: 'id',
      properties: {
        "printable_name": {
          name: 'printable_name',
          type: 'string'
        },
        "postal_code": {
          name: 'postal_code',
          type: 'string'
        },
        "city_code": {
          name: 'city_code',
          type: 'string'
        },
        "geolocation": {
          name: 'geolocation',
          type: 'any'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "provinceId": {
          name: 'provinceId',
          type: 'number'
        },
      },
      relations: {
        province: {
          name: 'province',
          type: 'Province',
          model: 'Province',
          relationType: 'belongsTo',
                  keyFrom: 'provinceId',
          keyTo: 'id'
        },
        location: {
          name: 'location',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'cityId'
        },
      }
    }
  }
}
