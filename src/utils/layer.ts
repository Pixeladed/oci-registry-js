import { LocalLayer } from '../artifact/types';
import { OCIDescriptor, Client } from '../network';
import mediaType from './mediaType';
import identifier from './identifier';
import storage from './storage';

const fromDescriptor = async (
  name: string,
  descriptor: OCIDescriptor,
  client: Client
): Promise<LocalLayer> => {
  const { digest } = descriptor;

  const buffer = await client.fetchBlob({
    name,
    digest,
  });

  const layerId = identifier.getLayerId({ name, digest });
  const extension = mediaType.getExtension(descriptor.mediaType);
  const filename = layerId + extension;
  const path = await storage.write(filename, buffer);

  return { ...descriptor, path };
};

const toDescriptor = (layer: LocalLayer): OCIDescriptor => {
  return {
    digest: layer.digest,
    mediaType: layer.mediaType,
    size: layer.size,
    annotations: layer.annotations,
    urls: layer.urls,
  };
};

export default { fromDescriptor, toDescriptor };
