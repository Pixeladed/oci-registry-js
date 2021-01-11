import { AxiosTransformer } from 'axios';

export interface RegistryOptions {
  url: string;
  apiVersion?: string;
  transformers?: AxiosTransformer[];
}

export type IdentifierParam = string | { name: string; reference: string };
