import { AxiosTransformer } from 'axios';

export interface RegistryOptions {
  url: string;
  apiVersion?: string;
  transformers?: AxiosTransformer[];
}
