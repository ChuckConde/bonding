/* tslint:disable */

declare var Object: any;
export interface ProfessionalPreferencesInterface {
  "experience": boolean;
  "segment": Array<any>;
  "companyOfWork"?: string;
  "yearsOfExperience"?: string;
  "startOfActivities"?: Date;
  "purchaseVolume"?: string;
  "ownMobility"?: boolean;
  "ownMobilityDescription"?: string;
  "comission"?: number;
  "comissionDescription"?: string;
  "is_deleted": boolean;
  "created_at": Date;
  "updated_at": Date;
  "createdBy": number;
  "updatedBy": number;
  "id"?: number;
  "contactId"?: number;
  "accountId"?: number;
  contact?: any;
  account?: any;
  locations?: any[];
}

export class ProfessionalPreferences implements ProfessionalPreferencesInterface {
  "experience": boolean;
  "segment": Array<any>;
  "companyOfWork": string;
  "yearsOfExperience": string;
  "startOfActivities": Date;
  "purchaseVolume": string;
  "ownMobility": boolean;
  "ownMobilityDescription": string;
  "comission": number;
  "comissionDescription": string;
  "is_deleted": boolean;
  "created_at": Date;
  "updated_at": Date;
  "createdBy": number;
  "updatedBy": number;
  "id": number;
  "contactId": number;
  "accountId": number;
  contact: any;
  account: any;
  locations: any[];
  constructor(data?: ProfessionalPreferencesInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `ProfessionalPreferences`.
   */
  public static getModelName() {
    return "ProfessionalPreferences";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of ProfessionalPreferences for dynamic purposes.
  **/
  public static factory(data: ProfessionalPreferencesInterface): ProfessionalPreferences{
    return new ProfessionalPreferences(data);
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
      name: 'ProfessionalPreferences',
      plural: 'ProfessionalPreferences',
      path: 'ProfessionalPreferences',
      idName: 'id',
      properties: {
        "experience": {
          name: 'experience',
          type: 'boolean'
        },
        "segment": {
          name: 'segment',
          type: 'Array&lt;any&gt;'
        },
        "companyOfWork": {
          name: 'companyOfWork',
          type: 'string'
        },
        "yearsOfExperience": {
          name: 'yearsOfExperience',
          type: 'string'
        },
        "startOfActivities": {
          name: 'startOfActivities',
          type: 'Date'
        },
        "purchaseVolume": {
          name: 'purchaseVolume',
          type: 'string'
        },
        "ownMobility": {
          name: 'ownMobility',
          type: 'boolean'
        },
        "ownMobilityDescription": {
          name: 'ownMobilityDescription',
          type: 'string'
        },
        "comission": {
          name: 'comission',
          type: 'number'
        },
        "comissionDescription": {
          name: 'comissionDescription',
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
        "contactId": {
          name: 'contactId',
          type: 'number'
        },
        "accountId": {
          name: 'accountId',
          type: 'number'
        },
      },
      relations: {
        contact: {
          name: 'contact',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'contactId',
          keyTo: 'id'
        },
        account: {
          name: 'account',
          type: 'any',
          model: '',
          relationType: 'belongsTo',
                  keyFrom: 'accountId',
          keyTo: 'id'
        },
        locations: {
          name: 'locations',
          type: 'any[]',
          model: '',
          relationType: 'hasMany',
          modelThrough: 'Zone',
          keyThrough: 'zoneId',
          keyFrom: 'id',
          keyTo: 'locationId'
        },
      }
    }
  }
}
