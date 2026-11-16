import { type Express } from 'express';
import { apiReference } from '@scalar/express-api-reference';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import YAML from 'yaml';

export const setupDocs = (app: Express, specPath: string) => {
    const absolutePath = resolve(process.cwd(), specPath);
    const spec = YAML.parse(readFileSync(absolutePath, 'utf8'));
    app.use('/docs', apiReference({ spec: { content: spec } }));
};