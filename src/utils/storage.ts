import path from 'path';
import fs from 'fs';

const DIR_PREFIX = process.cwd();
const TEMP_DIR = path.join(DIR_PREFIX, 'tmp');

const getPath = (name: string) => path.resolve(path.join(TEMP_DIR, name));

const write = async (name: string, data: Buffer) => {
  const path = getPath(name);

  return new Promise<string>((resolve, reject) => {
    fs.writeFile(path, data, error => {
      if (error) {
        return reject(error);
      }
      return resolve(path);
    });
  });
};

export default { getPath, write };
