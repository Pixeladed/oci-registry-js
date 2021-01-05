import { BlobIdentifier, ManifestIdentifier } from './types';

const pullManifest = (identifier: ManifestIdentifier) => {
  const { name, reference } = identifier;
  return `/${name}/manifests/${reference}`;
};

const pullBlob = (identifier: BlobIdentifier) => {
  const { name, digest } = identifier;
  return `/${name}/blobs/${digest}`;
};

export default {
  pullManifest,
  pullBlob,
};
