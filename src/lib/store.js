// src/stores/localStore.js
import { writable } from 'svelte/store';

export function createLocalStore(key, startValue) {
  // 1. Check if we are in the browser (important for SvelteKit/SSR)
  const isBrowser = typeof localStorage !== 'undefined';

  // 2. Get the saved value from localStorage if it exists, otherwise use startValue
  const saved = isBrowser ? localStorage.getItem(key) : null;
  const initial = saved ? JSON.parse(saved) : startValue;

  // 3. Create the writable store with that data
  const { subscribe, set, update } = writable(initial);

  // 4. Subscribe to the store: whenever it changes, save to localStorage
  subscribe(value => {
    if (isBrowser) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  });

  return {
    subscribe,
    set,
    update
  };
}

export const StudiesStore = createLocalStore('studies', []);