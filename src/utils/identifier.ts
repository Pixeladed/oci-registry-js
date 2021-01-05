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

export default { parse, validate };
