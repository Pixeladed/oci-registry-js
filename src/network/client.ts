import {
  ArtifactManifest,
  ArtifactTags,
  BlobIdentifier,
  ManifestIdentifier,
  NetworkOptions,
} from './types';
import Axios, { AxiosInstance } from 'axios';

import endpoints from './endpoints';
import joinURL from 'url-join';
import identifier from '../utils/identifier';

export default class Client {
  private agent: AxiosInstance;

  constructor(options: NetworkOptions) {
    const { url, apiVersion, transformers } = options;

    const baseURL = joinURL(url, apiVersion);
    const instance = Axios.create({
      baseURL,
      transformRequest: transformers,
    });

    this.agent = instance;
  }

  async fetchManifest(identifier: ManifestIdentifier) {
    const response = await this.agent.get<ArtifactManifest>(
      endpoints.pullManifest(identifier),
      {
        headers: {
          Accept:
            'application/vnd.oci.image.manifest.v1+json, application/vnd.docker.distribution.manifest.v2+json',
        },
      }
    );

    return response.data;
  }

  async fetchBlob(identifier: BlobIdentifier) {
    const response = await this.agent.get<Buffer>(
      endpoints.pullBlob(identifier),
      { responseType: 'arraybuffer' }
    );

    return response.data;
  }

  async pushBlob(name: string, blob: Buffer) {
    const digest = identifier.digest(blob);

    const response = await this.agent.post<null>(
      endpoints.pushBlob({ name, digest }),
      blob,
      {
        headers: {
          'Content-Length': blob.length,
          'Content-Type': 'application/octet-stream',
        },
      }
    );

    const location: string | undefined = response.headers['Location'];
    return location;
  }

  async mountBlob(options: {
    name: string;
    digest: string;
    repository: string;
  }) {
    const response = await this.agent.post<null>(endpoints.mountBlob(options));

    const location: string | undefined = response.headers['Location'];
    return location;
  }

  async pushManifest(
    identifier: ManifestIdentifier,
    manifest: ArtifactManifest
  ) {
    const content = Buffer.from(JSON.stringify(manifest));
    const response = await this.agent.post(
      endpoints.pushManifest(identifier),
      content,
      {
        headers: {
          'Content-Type': 'application/vnd.oci.image.manifest.v1+json',
        },
      }
    );

    const location: string | undefined = response.headers['Location'];
    return location;
  }

  async fetchTags(name: string) {
    const { data } = await this.agent.get<ArtifactTags>(
      endpoints.pullTags(name)
    );
    return data.tags;
  }

  async deleteTag(identifier: { name: string; tag: string }) {
    await this.agent.delete<null>(endpoints.deleteTag(identifier));
  }

  async deleteManifest(identifier: { name: string; digest: string }) {
    await this.agent.delete<null>(endpoints.deleteManifest(identifier));
  }

  async deleteBlob(identifier: { name: string; digest: string }) {
    await this.agent.delete<null>(endpoints.deleteBlob(identifier));
  }
}
