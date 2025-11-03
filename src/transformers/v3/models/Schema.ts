import { OpenAPIV3 } from 'openapi-types';
import { Dereferenced } from '../../../types';

export interface SchemaInterface {
  type?: string;
  format?: string;
  ref?: string;
  allOf?: SchemaInterface[];
  oneOf?: SchemaInterface[];
  anyOf?: SchemaInterface[];
  not?: SchemaInterface;
  items?: SchemaInterface;
  properties?: { [name: string]: SchemaInterface };
  getType?(): string | undefined;
  getFormat?(): string | undefined;
  getItems?(): SchemaInterface;
  getReference(): string | undefined;
  getAllOf?(): SchemaInterface[];
  getOneOf?(): SchemaInterface[];
  getAnyOf?(): SchemaInterface[];
  getNot?(): SchemaInterface;
  getDefault?(): unknown;
  getEnum?(): unknown[];
}

export class Schema implements SchemaInterface {
  public type?: string;

  public format?: string;

  public ref?: string;

  public allOf?: SchemaInterface[];

  public oneOf?: SchemaInterface[];

  public anyOf?: SchemaInterface[];

  public not?: SchemaInterface;

  public items?: SchemaInterface;

  public properties?: { [name: string]: SchemaInterface } = {};

  public defaultValue?: unknown;

  public enum?: unknown[] = [];

  /**
   * constructor
   *
   * @param {OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject} [schema=undefined]
   */
  constructor(schema?: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject) {
    if (schema) {
      // Check if it's a Reference Object
      if ('$ref' in schema) {
        this.setReference(schema.$ref);
      } else {
        // It's a Schema Object
        if ('type' in schema && schema.type) {
          this.setType(schema.type);
        }
        if ('format' in schema && schema.format) {
          this.setFormat(schema.format);
        }
        if ('items' in schema && schema.items) {
          this.setItems(schema.items);
        }
        if ('allOf' in schema && schema.allOf) {
          this.setAllOf(schema.allOf);
        }
        if ('oneOf' in schema && schema.oneOf) {
          this.setOneOf(schema.oneOf);
        }
        if ('anyOf' in schema && schema.anyOf) {
          this.setAnyOf(schema.anyOf);
        }
        if ('not' in schema && schema.not) {
          this.setNot(schema.not);
        }
        if ('properties' in schema && schema.properties) {
          // At this point the document is dereferenced
          // So we can avoid the reference here
          this.setProperties(schema.properties);
        }
        if ('default' in schema) {
          this.setDefault(schema.default);
        }
        if ('enum' in schema && schema.enum) {
          this.enum = schema.enum;
        }
      }
    }
  }

  /**
   * @param {String} ref
   */
  public setReference(ref: string): Schema {
    this.ref = ref;
    return this;
  }

  /**
   * @return {String}
   */
  public getReference(): string | undefined {
    return this.ref;
  }

  /**
   * @param {string} defaultValue
   * @return {*}  {Schema}
   * @memberof Schema
   */
  public setDefault(defaultValue: unknown): Schema {
    this.defaultValue = defaultValue;
    return this;
  }

  public setEnum(enumValues: unknown[]): Schema {
    this.enum = enumValues;
    return this;
  }

  /**
   * @param {({
   *     [name: string]: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
   *   })} properties
   * @return {*}  {Schema}
   * @memberof Schema
   */
  public setProperties(properties: {
    [name: string]: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
  }): Schema {
    Object.keys(properties).forEach(
      (name) => {
        this.properties[name] = new Schema(properties[name] as OpenAPIV3.SchemaObject);
      },
    );
    return this;
  }

  /**
   * @param {String} type
   */
  public setType(type: string | string[]): Schema {
    // @todo: wtf
    this.type = type as string;
    return this;
  }

  /**
   * @param {Array<Object>} allOf
   */
  public setAllOf(allOf: (OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject)[]): Schema {
    this.allOf = allOf.map(
      (
        schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
      ) => new Schema(schema as Dereferenced<typeof schema>),
    );
    return this;
  }

  /**
   * @param {Array<Object>} oneOf
   */
  public setOneOf(oneOf: (OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject)[]): Schema {
    this.oneOf = oneOf.map(
      (
        schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
      ) => new Schema(schema as Dereferenced<typeof schema>),
    );
    return this;
  }

  /**
   * @param {Array<Object>} anyOf
   */
  public setAnyOf(anyOf: (OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject)[]): Schema {
    this.anyOf = anyOf.map(
      (
        schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
      ) => new Schema(schema as Dereferenced<typeof schema>),
    );
    return this;
  }

  /**
   * @param {Object} not
   */
  public setNot(not: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject): Schema {
    this.not = new Schema(not as Dereferenced<typeof not>);
    return this;
  }

  /**
   * @param {String} format
   */
  public setFormat(format: string): Schema {
    this.format = format;
    return this;
  }

  /**
   * @param {OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject} items
   */
  setItems(items: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject) {
    this.items = new Schema(items);
    return this;
  }

  /**
   * @return {String}
   */
  public getType(): string | undefined {
    return this.type;
  }

  /**
   * @return {String}
   */
  public getFormat(): string | undefined {
    return this.format;
  }

  /**
   * @return {Object}
   */
  public getItems(): SchemaInterface {
    return this.items;
  }

  /**
   * @return {Array<Schema>}
   */
  public getAllOf(): SchemaInterface[] {
    return this.allOf;
  }

  /**
   * @return {Array<Schema>}
   */
  public getOneOf(): SchemaInterface[] {
    return this.oneOf;
  }

  /**
   * @return {Array<Schema>}
   */
  public getAnyOf(): SchemaInterface[] {
    return this.anyOf;
  }

  /**
   * @return {Schema}
   */
  public getNot(): SchemaInterface {
    return this.not;
  }

  public getProperties() {
    return this.properties;
  }

  public getDefault(): unknown {
    return this.defaultValue;
  }

  public getEnum(): unknown[] {
    return this.enum;
  }
}
