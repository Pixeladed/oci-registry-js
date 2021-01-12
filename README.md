# OCI Registry JS

## Usage
```js

import { Registry } from 'oci-registry-js'

// create a new registry instance
const registry = new Registry({ url: 'http://localhost:5000' })

// retrieve a list of tags for an image
const tags = registry.pullTags('nginx')
  .then(tags => console.log('available nginx tags:', tags))

// pull an image
// this will store the image layers in a directory called '/tmp/:imageName'
registry.pull('nginx:latest')
  .then(artifact => console.log('pulled', artifact.name, 'with layers', artifact.layers))
// or you can also do
registry.pull({ name: 'nginx', reference: 'latest' })

```