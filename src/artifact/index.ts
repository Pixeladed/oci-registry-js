import { ArtifactManifest } from '../network';
import { ArtifactLayer } from './types';

export default class Artifact {
  name: string;
  reference: string;
  manifest: ArtifactManifest;
  layers: ArtifactLayer[];

  constructor(content: {
    name: string;
    reference: string;
    manifest: ArtifactManifest;
    layers: ArtifactLayer[];
  }) {
    this.name = content.name;
    this.reference = content.reference;
    this.manifest = content.manifest;
    this.layers = content.layers;
  }
}
