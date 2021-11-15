import { writable } from 'svelte/store';
import { browser } from '$app/env';
import type { Writable } from 'svelte/store';

interface Config {
    work: number,
    shortBreak: number,
    longBreak: number
}

const createConfig = (): Writable<Config> => {
    let data = browser ? window.localStorage.getItem('config') : null;
    let config: Config = data ? JSON.parse(data) : { work: 25, shortBreak: 5, longBreak: 15 } as Config;

    const { subscribe, set } = writable(config);

    return {
        subscribe,
        set: (n: Config) => {
            window.localStorage.setItem('config', JSON.stringify(n));
            set(n)
        },
        // Does nothing, just satisfying the `Writable` type req lol
        update: function (this: void) { }
    };
}

export const config = createConfig();