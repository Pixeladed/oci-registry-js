import { AxiosTransformer } from 'axios';

export interface RegistryOptions {
  url: string;
  apiVersion?: string;
  transformers?: AxiosTransformer[];
}

export type IdentifierParam = string | { name: string; tag: string };

export type ArtifactDataSource =
  | {
      type: 'path';
      path: string;
    }
  | { type: 'buffer'; buffer: Buffer };
