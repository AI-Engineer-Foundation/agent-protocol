/* tslint:disable */
/* eslint-disable */
/**
 * Agent Protocol
 * Specification of the API protocol for communication with an agent.
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
/**
 * Body of the task request.
 * @export
 * @interface StepRequestBody
 */
export interface StepRequestBody {
    /**
     * Input prompt for the step.
     * @type {string}
     * @memberof StepRequestBody
     */
    input?: string;
    /**
     * Input parameters for the task step. Any value is allowed.
     * @type {object}
     * @memberof StepRequestBody
     */
    additionalInput?: object;
}

/**
 * Check if a given object implements the StepRequestBody interface.
 */
export function instanceOfStepRequestBody(value: object): boolean {
    return true;
}

export function StepRequestBodyFromJSON(json: any): StepRequestBody {
    return StepRequestBodyFromJSONTyped(json, false);
}

export function StepRequestBodyFromJSONTyped(json: any, ignoreDiscriminator: boolean): StepRequestBody {
    if (json == null) {
        return json;
    }
    return {
        
        'input': json['input'] == null ? undefined : json['input'],
        'additionalInput': json['additional_input'] == null ? undefined : json['additional_input'],
    };
}

export function StepRequestBodyToJSON(value?: StepRequestBody | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'input': value['input'],
        'additional_input': value['additionalInput'],
    };
}
