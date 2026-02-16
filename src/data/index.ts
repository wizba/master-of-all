export type { Flashcard, CardProgress, Task, Domain } from './types';
export { domain1Tasks } from './domain1';
export { domain2Tasks } from './domain2';
export { domain3Tasks } from './domain3';
export { domain4Tasks } from './domain4';

import type { Domain } from './types';
import { domain1Tasks } from './domain1';
import { domain2Tasks } from './domain2';
import { domain3Tasks } from './domain3';
import { domain4Tasks } from './domain4';

export const domains: Domain[] = [
  {
    id: 'domain1',
    name: 'Domain 1: Design Secure Architectures',
    subtitle: '30% of exam',
    icon: '\u{1F510}',
    color: 'from-blue-500 to-indigo-600',
    tasks: domain1Tasks
  },
  {
    id: 'domain2',
    name: 'Domain 2: Design Resilient Architectures',
    subtitle: '26% of exam',
    icon: '\u{1F3D7}\uFE0F',
    color: 'from-green-500 to-emerald-600',
    tasks: domain2Tasks
  },
  {
    id: 'domain3',
    name: 'Domain 3: Design High-Performing Architectures',
    subtitle: '24% of exam',
    icon: '\u26A1',
    color: 'from-orange-500 to-red-600',
    tasks: domain3Tasks
  },
  {
    id: 'domain4',
    name: 'Domain 4: Design Cost-Optimized Architectures',
    subtitle: '20% of exam',
    icon: '\u{1F4B0}',
    color: 'from-purple-500 to-violet-600',
    tasks: domain4Tasks
  }
];
