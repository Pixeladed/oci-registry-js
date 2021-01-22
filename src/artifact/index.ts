import { ArtifactManifest } from '../network';
import { LocalLayer } from './types';
import path from 'path';
import fs from 'fs';

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

  async copyTo(destinationPath: string) {
    const absolutePath = path.resolve(destinationPath);
    if (
      !fs.existsSync(absolutePath) ||
      !fs.statSync(absolutePath).isDirectory()
    ) {
      throw new Error('The destination does not exist or is not a directory');
    }

    const ops = this.layers.map(
      layer =>
        new Promise((resolve, reject) => {
          const filename = path.parse(layer.path).base;
          const destinationName = path.resolve(absolutePath, filename);
          fs.copyFile(layer.path, destinationName, reject);

          return resolve(destinationName);
        })
    );

    await Promise.all(ops);
  }
}
