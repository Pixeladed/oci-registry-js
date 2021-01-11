import { ArtifactManifest, Client } from '../network';
import { InvalidIdentifierError } from '../errors';
import { ArtifactDataSource, IdentifierParam, RegistryOptions } from './types';
import identifier from '../utils/identifier';
import fs from 'fs';

export default class Registry {
  url: string;
  apiVersion: string;

  private client: Client;

  constructor(options: RegistryOptions) {
    const { url, transformers, apiVersion = 'v2' } = options;

    this.url = url;
    this.apiVersion = apiVersion;
    this.client = new Client({ url, apiVersion, transformers });
  }

  async pull(id: IdentifierParam) {
    const { name, tag } = identifier.parse(id);

    const isValidIdentifier = identifier.validate({ name, tag });
    if (!isValidIdentifier) {
      throw new InvalidIdentifierError(
        `Invalid identifier provided: ${name}:${tag}`
      );
    }

    return this.client.fetchArtifact({ name, reference: tag });
  }

  async push(
    id: IdentifierParam,
    manifest: ArtifactManifest,
    data: ArtifactDataSource
  ) {
    const { name, tag } = identifier.parse(id);

    let blob: Buffer;
    if (data.type === 'path') {
      blob = fs.readFileSync(data.path);
    } else {
      blob = data.buffer;
    }

    const manifestLocation = await this.client.pushManifest(
      { name, reference: tag },
      manifest
    );
    const blobLocation = await this.client.pushBlob(name, blob);

    return { manifestLocation, blobLocation };
  }
}
