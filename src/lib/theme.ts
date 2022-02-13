// import { browser } from "$app/env";

// const createTheme = (): Writable<string> => {
//     const data = browser ? window.localStorage.getItem('theme') : null;
//     const dataReal = data ? data : "Chrome";

//     const { subscribe, set } = writable(dataReal);

//     return {
//         subscribe,
//         set: (n: string) => {
//             browser ? window.localStorage.setItem('theme', n) : {};
//             set(n)
//         },
//         // Does nothing, just satisfying the `Writable` type req lol
//         // eslint-disable-next-line @typescript-eslint/no-empty-function
//         update: function (this: void) { }
//     };
// }

// export const themeName = createTheme();

// export const theme = derived(
//     themeName,
//     $themeName => {
//         console.log('loaded1231231');
//         const theme = themes.find((t) => t.name == $themeName);
//         if (theme) {
//         console.log('22loaded1231231');
//             return theme;
//         } else {
//             return themes[0]
//         }
//     }
// );

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

// export const themes: Theme[] = [
//     {
//         name: 'Chrome',
//         blk: '#7c6f64',
//         red: '#ea6962',
//         grn: '#a9b665',
//         yel: '#d8a657',
//         blu: '#7daea3',
//         mag: '#d3869b',
//         cya: '#89b482',
//         wht: '#fbf1c7',
//         foregroundColor: 'black',
//         backgroundColor: 'white',
//         backdrop: '0, 0, 0',
//         variant: 'light'
//     },
//     {
//         name: 'Gruvbox Material Light',
//         blk: '#7c6f64',
//         red: '#ea6962',
//         grn: '#a9b665',
//         yel: '#d8a657',
//         blu: '#7daea3',
//         mag: '#d3869b',
//         cya: '#89b482',
//         wht: '#fbf1c7',
//         foregroundColor: '#7c6f64',
//         backgroundColor: '#fbf1c7',
//         backdrop: '124, 111, 100',
//         variant: 'light'
//     },
//     {
//         name: 'Gruvbox Material Dark',
//         blk: '#292828',
//         red: '#ea6962',
//         grn: '#a9b665',
//         yel: '#d8a657',
//         blu: '#7daea3',
//         mag: '#d3869b',
//         cya: '#89b482',
//         wht: '#d4be98',
//         foregroundColor: '#d4be98',
//         backgroundColor: '#292828',
//         backdrop: '212, 190, 152',
//         variant: 'dark'
//     },
//     // {
//     //     name: 'Solarized Light',
//     //     blk: '#657b83',
//     //     red: '#dc322f',
//     //     grn: '#859900',
//     //     yel: '#b58900',
//     //     blu: '#268bd2',
//     //     mag: '#d33682',
//     //     cya: '#2aa198',
//     //     wht: '#fdf6e3',
//     //     foregroundColor: '#657b83',
//     //     backgroundColor: '#fdf6e3',
//     //     backdrop: '101, 123, 131',
//     //     variant: 'light'
//     // },
//     // {
//     //     name: 'Solarized Dark',
//     //     blk: '#839496',
//     //     red: '#ea6962',
//     //     grn: '#a9b665',
//     //     yel: '#d8a657',
//     //     blu: '#7daea3',
//     //     mag: '#d3869b',
//     //     cya: '#89b482',
//     //     wht: '#002b36',
//     //     foregroundColor: '#002b36',
//     //     backgroundColor: '#839496',
//     //     backdrop: '0, 43, 54',
//     //     variant: 'dark'
//     // },
//     {
//         name: 'Catpuccin',
//         blk: '#111921',
//         red: '#F28FAD',
//         grn: '#ABE9B3',
//         yel: '#FAE3B0',
//         blu: '#96CDFB',
//         mag: '#DDB6F2',
//         cya: '#89DCEB',
//         wht: '#C3BAC6',
//         foregroundColor: '#C3BAC6',
//         backgroundColor: '#111921',
//         backdrop: '195, 186, 198',
//         variant: 'dark'
//     },
// ];