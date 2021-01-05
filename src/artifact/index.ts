import { ArtifactBlob, ArtifactManifest } from '../network';

export default class Artifact {
  manifest: ArtifactManifest;
  blob?: ArtifactBlob;

  constructor(content: { manifest: ArtifactManifest; blob?: ArtifactBlob }) {
    this.manifest = content.manifest;
    this.blob = content.blob;
  }
}
