import {ColorEnum, CountryEnum, OrganizationEnum, PositionEnum, StatusEnum} from "../../shared/constants";

export const locationSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "/Location",
    type: "object",
    "properties": {
        "x": {"type": "number"},
        "y": {"type": "integer"},
        "z": {"type": "integer"}
    },
    "required": ["x", "z"]
};
export const addressSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    "id": "/Address",
    "type": "object",
    "properties": {
        "zipCode": {
            "type": "string",
        },
        "town": {
            "oneOf": [
                {"$ref": "/Location"},
                {"type": "null"}
            ]
        }
    },
    "required": ["zipCode"]
};
export const coordinatesSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    "id": "/Coordinates",
    "type": "object",
    "properties": {
        "x": {
            "type": "number",
            "maximum": 960
        },
        "y": {
            "type": "integer",
            "maximum": 12
        }
    }
};
export const personSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    "id": "/Person",
    "type": "object",
    "properties": {
        "eyeColor": {
            "type": "string",
            "enum": [`${ColorEnum.GREEN}`, `${ColorEnum.BLACK}`, `${ColorEnum.BLUE}`, `${ColorEnum.ORANGE}`]
        },
        "hairColor": {
            "type": ["string", "null"],
            "enum": [null, `${ColorEnum.GREEN}`, `${ColorEnum.BLACK}`, `${ColorEnum.BLUE}`, `${ColorEnum.ORANGE}`]
        },
        "birthday": {
            "type": ["string", "null"],
            "format": "date"
        },
        "location": {"$ref": "/Location"},
        "weight": {
            "type": "number",
            "exclusiveMinimum": 0
        },
        "nationality": {
            "type": "string",
            "enum": [`${CountryEnum.UNITED_KINGDOM}`, `${CountryEnum.FRANCE}`, `${CountryEnum.NORTH_KOREA}`]
        },
        "required": ["eyeColor", "location", "weight", "nationality"]
    }
};
export const organizationSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    "id": "/Organization",
    "type": "object",
    "properties": {
        "officialAddress": {"$ref": "/Address"},
        "annualTurnover": {
            "type": "number",
            "exclusiveMinimum": 0
        },
        "employeesCount": {
            "type": "integer",
            "exclusiveMinimum": 0
        },
        "fullName": {
            "type": ["string", "null"],
            "minLength": 1,
            "maxLength": 1576
        },
        "organizationType": {
            "type": ["string", "null"],
            "enum": [null, `${OrganizationEnum.COMMERCIAL}`, `${OrganizationEnum.PUBLIC}`, `${OrganizationEnum.GOVERNMENT}`, `${OrganizationEnum.TRUST}`, `${OrganizationEnum.PRIVATE_LIMITED_COMPANY}`]
        },
        "postalAddress": {"$ref": "/Address"}
    },
    "required": ["officialAddress", "annualTurnover", "fullName", "postalAddress"]
};
export const workerSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    "id": "/Worker",
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "minLength": 1
        },
        "coordinates": {"$ref": "/Coordinates"},
        "organization": {
            "oneOf": [
                {"$ref": "/Organization"},
                {"type": "null"}
            ]
        },
        "salary": {
            "type": ["number", "null"],
            "exclusiveMinimum": 0
        },
        "rating": {
            "type": "integer",
            "exclusiveMinimum": 0
        },
        "position": {
            "type": "string",
            "enum": [`${PositionEnum.DIRECTOR}`, `${PositionEnum.LABORER}`, `${PositionEnum.BAKER}`]
        },
        "status": {
            "type": ["string", "null"],
            "enum": [null, `${StatusEnum.FIRED}`, `${StatusEnum.HIRED}`, `${StatusEnum.RECOMMENDED_FOR_PROMOTION}`,`${StatusEnum.REGULAR}`]
        },
        "person": {"$ref": "/Person"},
        "useExistingCoordinates": {"type": "boolean"},
        "useExistingOrganization": {"type": "boolean"},
        "useExistingPerson": {"type": "boolean"},
        "useExistingOfficialAddress": {"type": "boolean"},
        "useExistingPostalAddress": {"type": "boolean"},
        "useExistingLocation": {"type": "boolean"},
        "useExistingOfficialTown": {"type": "boolean"},
        "useExistingPostalTown": {"type": "boolean"}
    },
    "required": ["name", "coordinates", "position", "person"]
};