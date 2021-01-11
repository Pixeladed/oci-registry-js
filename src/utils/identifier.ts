import crypto from 'crypto';

export interface ArtifactIdentifier {
  name: string;
  tag: string;
}

const parse = (identifier: string): ArtifactIdentifier => {
  const [name, tag] = identifier.split(':');
  return { name, tag };
};

const validate = (identifier: ArtifactIdentifier) => {
  const nameRegex = new RegExp(
    '[a-z0-9]+([._-][a-z0-9]+)*(/[a-z0-9]+([._-][a-z0-9]+)*)*'
  );
  const validName = nameRegex.test(identifier.name);

  return validName;
};

const digest = (blob: Buffer) => {
  const algorithm = 'sha256';
  const hash = crypto
    .createHash(algorithm)
    .update(blob)
    .digest();
  const digest = `${algorithm}:${hash}`;
  return digest;
};

export default { parse, validate, digest };
