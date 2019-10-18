/* tslint:disable */
import {
  Location,
  ProfessionalPreferences
} from '../index';

declare var Object: any;
export interface ZoneInterface {
  "is_deleted": boolean;
  "id"?: number;
  "locationId"?: number;
  "professionalPreferencesId"?: number;
  location?: Location;
  professionalPreferences?: ProfessionalPreferences;
}

export class Zone implements ZoneInterface {
  "is_deleted": boolean;
  "id": number;
  "locationId": number;
  "professionalPreferencesId": number;
  location: Location;
  professionalPreferences: ProfessionalPreferences;
  constructor(data?: ZoneInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Zone`.
   */
  public static getModelName() {
    return "Zone";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Zone for dynamic purposes.
  **/
  public static factory(data: ZoneInterface): Zone{
    return new Zone(data);
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
      name: 'Zone',
      plural: 'Zones',
      path: 'Zones',
      idName: 'id',
      properties: {
        "is_deleted": {
          name: 'is_deleted',
          type: 'boolean',
          default: false
        },
        "id": {
          name: 'id',
          type: 'number'
        },
        "locationId": {
          name: 'locationId',
          type: 'number'
        },
        "professionalPreferencesId": {
          name: 'professionalPreferencesId',
          type: 'number'
        },
      },
      relations: {
        location: {
          name: 'location',
          type: 'Location',
          model: 'Location',
          relationType: 'belongsTo',
                  keyFrom: 'locationId',
          keyTo: 'id'
        },
        professionalPreferences: {
          name: 'professionalPreferences',
          type: 'ProfessionalPreferences',
          model: 'ProfessionalPreferences',
          relationType: 'belongsTo',
                  keyFrom: 'professionalPreferencesId',
          keyTo: 'id'
        },
      }
    }
  }
}
