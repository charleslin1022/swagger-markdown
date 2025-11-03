import { OpenAPIV3 } from 'openapi-types';
import { Markdown } from '../../lib/markdown';
import { Dereferenced } from '../../types';
import { Schema } from './models/Schema';
import { dataTypeResolver } from './dataTypes';

export function transformRequestBody(
  requestBody: OpenAPIV3.RequestBodyObject,
) {
  const md = Markdown.md();
  md.line(md.string('Request Body').h4()).line();

  if ('description' in requestBody && requestBody.description) {
    md.line(md.string(requestBody.description).escape()).line();
  }

  const table = md.table();
  table.th('Required').th('Schema');
  const tr = table.tr();

  // Required
  tr.td(requestBody.required ? 'Yes' : 'No');

  const { content } = requestBody;
  const schemaCellParts: string[] = [];

  Object.keys(content).forEach((contentType: string) => {
    const { schema } = content[contentType];
    if (!schema) {
      return;
    }

    const schemaObject = new Schema(schema as Dereferenced<typeof schema>);
    const resolvedType = dataTypeResolver(schemaObject);
    const typeString = md.string(contentType).bold().concat(`: ${resolvedType}`).get();
    schemaCellParts.push(typeString);
  });

  tr.td(schemaCellParts.join('<br>'));

  md.line(table);

  return md.export();
}
