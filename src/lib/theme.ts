// import { browser } from "$app/env";

import { derived, writable } from "svelte/store";
// import type { Writable } from "svelte/store";

// export const activated = writable(false);

export const selected_theme = writable('Gruvbox Material Dark');

export const theme = derived(
    selected_theme,
    $selected_theme => {
        const theme = themes.find((t) => t.name == $selected_theme);
        if (theme) {
            return theme;
        } else {
            return themes[0]
        }
    }
);

// selected_theme.subscribe((s) => {
//     console.log(s);
// });

export interface Theme {
    name: string;
    blk: string;
    red: string;
    grn: string;
    yel: string;
    blu: string;
    mag: string;
    cya: string;
    wht: string;
    foregroundColor: string;
    backgroundColor: string;
    backdrop: string;
    variant: string;
}

export const themes: Theme[] = [
    {
        name: 'Chrome',
        blk: '#7c6f64',
        red: '#ea6962',
        grn: '#a9b665',
        yel: '#d8a657',
        blu: '#7daea3',
        mag: '#d3869b',
        cya: '#89b482',
        wht: '#fbf1c7',
        foregroundColor: 'black',
        backgroundColor: 'white',
        backdrop: '0, 0, 0',
        variant: 'light'
    },
    {
        name: 'Gruvbox Material Light',
        blk: '#7c6f64',
        red: '#ea6962',
        grn: '#a9b665',
        yel: '#d8a657',
        blu: '#7daea3',
        mag: '#d3869b',
        cya: '#89b482',
        wht: '#fbf1c7',
        foregroundColor: '#7c6f64',
        backgroundColor: '#fbf1c7',
        backdrop: '124, 111, 100',
        variant: 'light'
    },
    {
        name: 'Gruvbox Material Dark',
        blk: '#292828',
        red: '#ea6962',
        grn: '#a9b665',
        yel: '#d8a657',
        blu: '#7daea3',
        mag: '#d3869b',
        cya: '#89b482',
        wht: '#d4be98',
        foregroundColor: '#d4be98',
        backgroundColor: '#292828',
        backdrop: '212, 190, 152',
        variant: 'dark'
    },
];