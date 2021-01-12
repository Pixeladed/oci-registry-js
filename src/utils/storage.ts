import path from 'path';
import fs from 'fs';

const DIR_PREFIX = process.cwd();
const TEMP_DIR = path.join(DIR_PREFIX, 'tmp');

const getPath = (name: string) => path.resolve(path.join(TEMP_DIR, name));

const write = async (name: string, data: Buffer) => {
  const filePath = getPath(name);
  const { dir } = path.parse(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return new Promise<string>((resolve, reject) => {
    fs.writeFile(filePath, data, error => {
      if (error) {
        return reject(error);
      }
      return resolve(filePath);
    });
  });
};

const read = async (path: string) => {
  return new Promise<Buffer>((resolve, reject) =>
    fs.readFile(path, (error, data) => {
      if (error) return reject(error);
      return resolve(data);
    })
  );
};

export default { getPath, write, read };
