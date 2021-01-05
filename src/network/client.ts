import {
  ArtifactBlob,
  ArtifactManifest,
  BlobIdentifier,
  ManifestIdentifier,
  NetworkOptions,
} from './types';
import Axios, { AxiosInstance } from 'axios';

import Artifact from '../artifact';
import endpoints from './endpoints';
import joinURL from 'url-join';

export default class Client {
  private agent: AxiosInstance;

  constructor(options: NetworkOptions) {
    const { url, apiVersion } = options;

    const baseURL = joinURL(url, apiVersion);
    const instance = Axios.create({
      baseURL,
    });

    this.agent = instance;
  }

  async fetchManifest(identifier: ManifestIdentifier) {
    const response = await this.agent.get<ArtifactManifest>(
      endpoints.pullManifest(identifier),
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    return {
      manifest: response.data,
      blobDigest: response.headers['docker-content-digest'],
    };
  }

  async fetchBlob(identifier: BlobIdentifier) {
    const response = await this.agent.get<ArtifactBlob>(
      endpoints.pullBlob(identifier)
    );

    return response.data;
  }

  async fetchArtifact(identifier: ManifestIdentifier) {
    const { manifest, blobDigest } = await this.fetchManifest(identifier);

    if (blobDigest) {
      const blob = await this.fetchBlob({
        name: identifier.name,
        digest: blobDigest,
      });

      return new Artifact({ manifest, blob });
    }

    return new Artifact({ manifest });
  }
}
