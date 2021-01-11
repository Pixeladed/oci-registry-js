import crypto from 'crypto';
import { InvalidIdentifierError } from '../errors';

export interface ArtifactIdentifier {
  name: string;
  reference: string;
}

const deconstruct = (identifier: string): ArtifactIdentifier => {
  const [name, reference] = identifier.split(':');
  return { name, reference };
};

const parse = (identifier: string | ArtifactIdentifier) => {
  let result: ArtifactIdentifier;

  if (
    typeof identifier === 'object' &&
    'name' in identifier &&
    'reference' in identifier
  ) {
    result = identifier;
  } else {
    result = deconstruct(identifier);
  }

  const isValidIdentifier = validate(result);
  if (!isValidIdentifier) {
    throw new InvalidIdentifierError(
      `Invalid identifier provided: ${result.name}:${result.reference}`
    );
  }

  return result;
};

const validate = (identifier: ArtifactIdentifier) => {
  const nameRegex = new RegExp(
    '[a-z0-9]+([._-][a-z0-9]+)*(/[a-z0-9]+([._-][a-z0-9]+)*)*'
  );
  const validName = nameRegex.test(identifier.name);

  return validName;
};

const digest = (content: Buffer | object) => {
  const data = Buffer.isBuffer(content)
    ? content
    : Buffer.from(JSON.stringify(content));
  const algorithm = 'sha256';
  const hash = crypto
    .createHash(algorithm)
    .update(data)
    .digest();
  const digest = `${algorithm}:${hash}`;
  return digest;
};

const getLayerId = (options: { name: string; digest: string }) => {
  const { name, digest } = options;
  return `${name}.${digest}`;
};

export default { parse, validate, digest, getLayerId };
