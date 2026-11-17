import { type Express } from 'express';
import { apiReference } from '@scalar/express-api-reference';
import { readFileSync } from 'node:fs';
import YAML from 'yaml';

export const setupDocs = (app: Express, specPath: string) => {
    const spec = YAML.parse(readFileSync(specPath, 'utf8'));
    app.use('/docs', apiReference({ spec: { content: spec } }));
};