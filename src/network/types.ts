import { AxiosTransformer } from 'axios';

export interface NetworkOptions {
  url: string;
  apiVersion: string;
  transformers?: AxiosTransformer[];
}

export interface ManifestIdentifier {
  name: string;
  reference: string;
}

export interface BlobIdentifier {
  name: string;
  digest: string;
}

export interface ArtifactIndex {
  schemaVersion: number;
  mediaType: string;
  manifests: ArtifactManifest;
}

/**
 * OCI Image Spec Manifest
 */
export interface ArtifactManifest {
  schemaVersion: number;
  mediaType: string;
  config: OCIDescriptor;
  layers: OCIDescriptor[];
  annotations: { [key: string]: string };
}

/**
 * OCI Image Spec Descriptor type
 */
export interface OCIDescriptor {
  mediaType: string;
  size: number;
  digest: string;
  urls?: string[];
  annotations?: { [key: string]: string };
  data: any;
}

export interface ArtifactTags {
  name: string;
  tags: string[];
}
