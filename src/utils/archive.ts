import tar from 'tar';
import storage from './storage';

const create = async (name: string, layerArchivePaths: string[]) => {
  const path = storage.getPath(`${name}.tgz`);
  await tar.c(
    {
      gzip: true,
      file: path,
    },
    layerArchivePaths
  );

  return path;
};

const detectMediaType = (path: string) => {
  if (
    /\.tar\.tz$/.test(path) ||
    /\.tgz$/.test(path) ||
    /\.tar\.gzip$/.test(path)
  ) {
    return 'application/vnd.oci.image.layer.v1.tar+gzip';
  } else if (/\.tar\.zst$/.test(path)) {
    return 'application/vnd.oci.image.layer.v1.tar+zstd';
  } else if (/\.tar$/.test(path)) {
    return 'application/vnd.oci.image.layer.v1.tar';
  } else {
    throw new Error(
      'Invalid file extension. Must be .tar.tz, .tgz, .tar.zst or .tar'
    );
  }
};

const getMediaTypeExtension = (mediaType: string) => {
  if (
    mediaType === 'application/vnd.oci.image.layer.v1.tar+gzip' ||
    mediaType === 'application/vnd.docker.image.rootfs.diff.tar.gzip'
  ) {
    return '.tgz';
  } else if (mediaType === 'application/vnd.oci.image.layer.v1.tar+zstd') {
    return '.tar.zst';
  } else if (mediaType === 'application/vnd.oci.image.layer.v1.tar') {
    return '.tar';
  } else {
    throw new Error('Invalid media type');
  }
};

export default { create, detectMediaType, getMediaTypeExtension };
