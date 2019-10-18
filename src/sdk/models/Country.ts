/* tslint:disable */
import {
  Province
} from '../index';

declare var Object: any;
export interface CountryInterface {
  "name": string;
  "dial": string;
  "iso2": string;
  "iso3": string;
  "printable_name": string;
  "numcode": string;
  "id"?: number;
  provinces?: Province[];
  location?: any[];
}

export class Country implements CountryInterface {
  "name": string;
  "dial": string;
  "iso2": string;
  "iso3": string;
  "printable_name": string;
  "numcode": string;
  "id": number;
  provinces: Province[];
  location: any[];
  constructor(data?: CountryInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Country`.
   */
  public static getModelName() {
    return "Country";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Country for dynamic purposes.
  **/
  public static factory(data: CountryInterface): Country{
    return new Country(data);
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
      name: 'Country',
      plural: 'Countries',
      path: 'Countries',
      idName: 'id',
      properties: {
        "name": {
          name: 'name',
          type: 'string'
        },
        "dial": {
          name: 'dial',
          type: 'string'
        },
        "iso2": {
          name: 'iso2',
          type: 'string'
        },
        "iso3": {
          name: 'iso3',
          type: 'string'
        },
        "printable_name": {
          name: 'printable_name',
          type: 'string'
        },
        "numcode": {
          name: 'numcode',
          type: 'string'
        },
        "id": {
          name: 'id',
          type: 'number'
        },
      },
      relations: {
        provinces: {
          name: 'provinces',
          type: 'Province[]',
          model: 'Province',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'countryId'
        },
        location: {
          name: 'location',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
                  keyFrom: 'id',
          keyTo: 'countryId'
        },
      }
    }
  }
}
