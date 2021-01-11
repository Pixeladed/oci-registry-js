import { ArtifactManifest, Client, OCIDescriptor } from '../network';
import { InvalidIdentifierError } from '../errors';
import { IdentifierParam, RegistryOptions } from './types';
import identifier from '../utils/identifier';
import Artifact from '../artifact';
import storage from '../utils/storage';
import archive from '../utils/archive';
import fs from 'fs';
import { ArtifactLayer } from '../artifact/types';

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

    const manifest = await this.client.fetchManifest({ name, reference });
    const layers = await Promise.all(
      manifest.layers.map(async layer => {
        const buffer = await this.client.fetchBlob({
          name,
          digest: layer.digest,
        });
        const path = await storage.write(
          identifier.getLayerId({ name, digest: layer.digest }),
          buffer
        );
        return { ...layer, path };
      })
    );

    return new Artifact({ name, reference, manifest, layers });
  }

  async push(
    id: IdentifierParam,
    manifest: Omit<ArtifactManifest, 'layers'>,
    archiveLayerPaths: string[]
  ) {
    const { name, reference } = identifier.parse(id);
    const layers = await Promise.all(
      archiveLayerPaths.map(
        layerPath =>
          new Promise<ArtifactLayer>((resolve, reject) => {
            fs.readFile(layerPath, async (error, data) => {
              if (error) {
                return reject(error);
              }
              await this.client.pushBlob(name, data);

              return resolve({
                digest: identifier.digest(data),
                path: layerPath,
                size: data.length,
                mediaType: archive.detectMediaType(layerPath),
              });
            });
          })
      )
    );

    const manifestWithLayers: ArtifactManifest = {
      ...manifest,
      layers: layers.map(
        (layer): OCIDescriptor => {
          return {
            digest: layer.digest,
            mediaType: layer.mediaType,
            size: layer.size,
            annotations: layer.annotations,
            urls: layer.urls,
          };
        }
      ),
    };

    await this.client.pushManifest({ name, reference }, manifestWithLayers);

    return new Artifact({
      name,
      reference,
      manifest: manifestWithLayers,
      layers,
    });
  }

  async pullTags(name: string) {
    return this.client.fetchTags(name);
  }
}
