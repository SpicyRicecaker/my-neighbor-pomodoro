import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Writable } from 'svelte/store';

interface Config {
    [work: string]: number,
    shortBreak: number,
    longBreak: number
}

const createConfig = (): Writable<Config> => {
    const data = browser ? window.localStorage.getItem('config') : null;
    const config: Config = data ? JSON.parse(data) : { work: 25, shortBreak: 5, longBreak: 15 } as Config;

    const { subscribe, set } = writable(config);

    return {
        subscribe,
        set: (n: Config) => {
            browser ? window.localStorage.setItem('config', JSON.stringify(n)) : {};
            set(n)
        },
        // Does nothing, just satisfying the `Writable` type req lol
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        update: function (this: void) { }
    };
}

export const config = createConfig();

const createTheme = (): Writable<boolean> => {
    const data = browser ? window.localStorage.getItem('themeVisible') : null;
    const config: boolean = data ? JSON.parse(data) : true;

    const { subscribe, set } = writable(config);

    return {
        subscribe,
        set: (n: boolean) => {
            browser ? window.localStorage.setItem('themeVisible', JSON.stringify(n)) : {};
            set(n)
        },
        // Does nothing, just satisfying the `Writable` type req lol
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        update: function (this: void) { }
    };
}

export const themeVisible = createTheme();