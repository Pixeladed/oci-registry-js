import { ArtifactManifest, Client } from '../network';
import { IdentifierParam, RegistryOptions } from './types';
import identifier from '../utils/identifier';
import Artifact from '../artifact';
import mediaType from '../utils/mediaType';
import { LocalLayer } from '../artifact/types';
import layer from '../utils/layer';
import storage from '../utils/storage';

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
      archiveLayerPaths.map<Promise<LocalLayer>>(async layerPath => {
        const data = await storage.read(layerPath);
        await this.client.pushBlob(name, data);

        return {
          digest: identifier.digest(data),
          path: layerPath,
          size: data.length,
          mediaType: mediaType.detect(layerPath),
        };
      })
    );

    const manifestWithLayers: ArtifactManifest = {
      ...manifest,
      layers: layers.map(layer.toDescriptor),
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
