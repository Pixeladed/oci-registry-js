const TYPES = [
  {
    name: 'application/vnd.oci.image.layer.v1.tar+gzip',
    aliases: ['application/vnd.docker.image.rootfs.diff.tar.gzip'],
    extensions: ['.tar.tz', '.tgz', '.tar.gzip'],
  },
  {
    name: 'application/vnd.oci.image.layer.v1.tar+zstd',
    aliases: [],
    extensions: ['.tar.zst'],
  },
  {
    name: 'application/vnd.oci.image.layer.v1.tar',
    aliases: [],
    extensions: ['.tar'],
  },
];

const detect = (path: string) => {
  TYPES.forEach(type => {
    const tests = type.extensions.map(
      extension => new RegExp(extension.replace('.', '\\.') + '$')
    );

    if (tests.some(regex => regex.test(path))) {
      return type.name;
    }
    return;
  });

  throw new Error(`Invalid file extension for file ${path}`);
};

const getExtension = (mediaType: string) => {
  TYPES.forEach(type => {
    if (
      (type.name === mediaType || type.aliases.includes(mediaType)) &&
      type.extensions.length
    ) {
      return type.extensions[0];
    }
    return;
  });
  throw new Error('Invalid media type');
};

export default { detect, getExtension };
