import { Ajv } from 'ajv';
import { FromSchema, JSONSchema } from 'json-schema-to-ts';

export type PortsWithSchema = { schema?: JSONSchema; hidden?: true };

export const ajv = new Ajv();

export const numberPortSchema = {
  type: 'number',
  title: 'Number',
  default: 1,
  // maximum: 50,
} as const satisfies JSONSchema;
export type NumberPort = FromSchema<typeof numberPortSchema>;
export const numberPortValidator = ajv.compile<NumberPort>(numberPortSchema);

export const textPortSchema = {
  type: 'string',
  title: 'Text',
  default: 'Type here…',
} as const satisfies JSONSchema;
export type TextPort = FromSchema<typeof textPortSchema>;
export const textPortValidator = ajv.compile<TextPort>(textPortSchema);
