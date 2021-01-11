import { ArtifactManifest } from '../network';
import { LocalLayer } from './types';

export default class Artifact {
  name: string;
  reference: string;
  manifest: ArtifactManifest;
  layers: LocalLayer[];

  constructor(content: {
    name: string;
    reference: string;
    manifest: ArtifactManifest;
    layers: LocalLayer[];
  }) {
    this.name = content.name;
    this.reference = content.reference;
    this.manifest = content.manifest;
    this.layers = content.layers;
  }
}
