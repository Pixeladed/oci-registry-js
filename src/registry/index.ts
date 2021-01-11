import { ArtifactManifest, Client } from '../network';
import { InvalidIdentifierError } from '../errors';
import { ArtifactDataSource, IdentifierParam, RegistryOptions } from './types';
import identifier from '../utils/identifier';
import fs from 'fs';
import Artifact from '../artifact';

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
    const { name, reference } = identifier.parse(id);

    const isValidIdentifier = identifier.validate({ name, reference });
    if (!isValidIdentifier) {
      throw new InvalidIdentifierError(
        `Invalid identifier provided: ${name}:${reference}`
      );
    }

    const { manifest, blob } = await this.client.fetchArtifact({
      name,
      reference: reference,
    });

    return new Artifact({ name, reference, manifest, blob });
  }

  async push(
    id: IdentifierParam,
    manifest: ArtifactManifest,
    data: ArtifactDataSource
  ) {
    const { name, reference } = identifier.parse(id);

    let blob: Buffer;
    if (data.type === 'path') {
      blob = fs.readFileSync(data.path);
    } else {
      blob = data.buffer;
    }

    await Promise.all([
      this.client.pushManifest({ name, reference }, manifest),
      this.client.pushBlob(name, blob),
    ]);

    return new Artifact({ name, reference, manifest, blob });
  }
}
