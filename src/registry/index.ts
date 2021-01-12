import { ArtifactManifest, Client, OCIDescriptor } from '../network';
import { IdentifierParam, RegistryOptions } from './types';
import identifier from '../utils/identifier';
import Artifact from '../artifact';
import mediaType from '../utils/mediaType';
import fs from 'fs';
import { LocalLayer } from '../artifact/types';
import layer from '../utils/layer';

export class Registry {
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

    const manifest = await this.client.fetchManifest({ name, reference });
    const layers = await Promise.all(
      manifest.layers.map(descriptor =>
        layer.fromDescriptor(name, descriptor, this.client)
      )
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
          new Promise<LocalLayer>((resolve, reject) => {
            fs.readFile(layerPath, async (error, data) => {
              if (error) {
                return reject(error);
              }
              await this.client.pushBlob(name, data);

              return resolve({
                digest: identifier.digest(data),
                path: layerPath,
                size: data.length,
                mediaType: mediaType.detect(layerPath),
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
