import { ArtifactManifest } from '../network';

export default class Artifact {
  name: string;
  reference: string;
  manifest: ArtifactManifest;
  blob: Buffer;

  constructor(content: {
    name: string;
    reference: string;
    manifest: ArtifactManifest;
    blob: Buffer;
  }) {
    this.name = content.name;
    this.reference = content.reference;
    this.manifest = content.manifest;
    this.blob = content.blob;
  }
}
