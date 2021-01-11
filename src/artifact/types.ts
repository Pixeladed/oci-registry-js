import { OCIDescriptor } from '../network';

export interface LocalLayer extends OCIDescriptor {
  path: string;
  buffer?: Buffer;
}
