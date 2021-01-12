import { Registry } from '../src/registry';

describe('registry', () => {
  it('creates a registry without crashing', () => {
    const registry = new Registry({ url: 'http://localhost:5000' });
    expect(registry).toBeInstanceOf(Registry);
  });
});
