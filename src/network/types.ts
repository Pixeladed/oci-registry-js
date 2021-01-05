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

export interface ArtifactManifest {
  mediaType: string;
  size: number;
  digest: string;
  platform: {
    architecture: string;
    os: string;
    'os.version'?: string;
    'os.features'?: string[];
    variant?: string;
    features?: string[];
  };
  annotations: { [key: string]: string };
}

export interface ArtifactBlob {
  schemaVersion: number;
  mediaType: string;
  config: {
    mediaType: string;
    size: number;
    digest: string;
  };
  layers: ArtifactLayer[];
  annotations: { [key: string]: string };
}

export interface ArtifactLayer {
  mediaType: string;
  size: number;
  digest: string;
  urls: string[];
}
