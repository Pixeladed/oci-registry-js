import { LocalLayer } from '../artifact/types';
import { OCIDescriptor, Client } from '../network';
import archive from './archive';
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
  const extension = archive.getMediaTypeExtension(descriptor.mediaType);
  const filename = layerId + extension;
  const path = await storage.write(filename, buffer);

  return { ...descriptor, path };
};

export default { fromDescriptor };
