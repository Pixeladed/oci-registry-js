import { BlobIdentifier, ManifestIdentifier } from './types';

const pullManifest = (identifier: ManifestIdentifier) => {
  const { name, reference } = identifier;
  return `/${name}/manifests/${reference}`;
};

const pullBlob = (identifier: BlobIdentifier) => {
  const { name, digest } = identifier;
  return `/${name}/blobs/${digest}`;
};

const pushBlob = (options: { name: string; digest: string }) => {
  const { name, digest } = options;
  return `/${name}/blobs/uploads/?digest=${digest}`;
};

const mountBlob = (options: {
  name: string;
  digest: string;
  repository: string;
}) => {
  const { name, digest, repository } = options;
  return `/${name}/blobs/uploads/?mount=${digest}&from=${repository}`;
};

const pushManifest = (identifier: ManifestIdentifier) => {
  const { name, reference } = identifier;
  return `/${name}/manifests/${reference}`;
};

const pullTags = (name: string) => {
  return `/${name}/tags/list`;
};

const deleteTag = (options: { name: string; tag: string }) => {
  const { name, tag } = options;
  return `/${name}/manifests/${tag}`;
};

const deleteManifest = (options: { name: string; digest: string }) => {
  const { name, digest } = options;
  return `/${name}/manifests/${digest}`;
};

const deleteBlob = (options: { name: string; digest: string }) => {
  const { name, digest } = options;
  return `/${name}/blobs/${digest}`;
};

export default {
  pullManifest,
  pullBlob,
  pushBlob,
  mountBlob,
  pushManifest,
  pullTags,
  deleteTag,
  deleteManifest,
  deleteBlob,
};
