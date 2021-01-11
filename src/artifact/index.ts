import { ArtifactManifest } from '../network';

export default class Artifact {
  manifest: ArtifactManifest;
  blob?: Buffer;

  constructor(content: { manifest: ArtifactManifest; blob?: Buffer }) {
    this.manifest = content.manifest;
    this.blob = content.blob;
  }
}
