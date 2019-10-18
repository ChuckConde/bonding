/* tslint:disable */
import {
  Country,
  City
} from '../index';

declare var Object: any;
export interface ProvinceInterface {
  "printable_name": string;
  "id"?: number;
  "countryId"?: number;
  country?: Country;
  cities?: City[];
  location?: any[];
}

export class Province implements ProvinceInterface {
  "printable_name": string;
  "id": number;
  "countryId": number;
  country: Country;
  cities: City[];
  location: any[];
  constructor(data?: ProvinceInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Province`.
   */
  public static getModelName() {
    return "Province";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Province for dynamic purposes.
  **/
  public static factory(data: ProvinceInterface): Province{
    return new Province(data);
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
      name: 'Province',
      plural: 'Provinces',
      path: 'Provinces',
      idName: 'id',
      properties: {
        "printable_name": {
          name: 'printable_name',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "countryId": {
          name: 'countryId',
          type: 'number'
        },
      },
      relations: {
        country: {
          name: 'country',
          type: 'Country',
          model: 'Country',
          relationType: 'belongsTo',
                  keyFrom: 'countryId',
          keyTo: 'id'
        },
        cities: {
          name: 'cities',
          type: 'City[]',
          model: 'City',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'provinceId'
        },
        location: {
          name: 'location',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'provinceId'
        },
      }
    }
  }
}
