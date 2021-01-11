const OCI = require('./dist/index');

const registry = new OCI.Registry({ url: 'http://localhost:5000' });

const main = async () => {
  const name = 'nginx';
  const tags = await registry.pullTags(name);
  console.log(name, tags);

  const image = await registry.pull('nginx:1');
  console.log('image is', image);
};

main();
