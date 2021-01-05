import { Client } from '../network';
import { InvalidIdentifierError } from '../errors';
import { RegistryOptions } from './types';
import identifier from '../utils/identifier';

export default class Registry {
  url: string;
  apiVersion: string;

  private client: Client;

  constructor(options: RegistryOptions) {
    const { url, apiVersion = 'v2' } = options;

    this.url = url;
    this.apiVersion = apiVersion;
    this.client = new Client({ url, apiVersion });
  }

  pull(id: string | { name: string; tag: string }) {
    let name: string;
    let tag: string;

    if (typeof id === 'string') {
      const data = identifier.parse(id);
      name = data.name;
      tag = data.tag;
    } else {
      name = id.name;
      tag = id.tag;
    }

    const isValidIdentifier = identifier.validate({ name, tag });
    if (!isValidIdentifier) {
      throw new InvalidIdentifierError(
        `Invalid identifier provided: ${name}:${tag}`
      );
    }

    return this.client.fetchArtifact({ name, reference: tag });
  }
}
