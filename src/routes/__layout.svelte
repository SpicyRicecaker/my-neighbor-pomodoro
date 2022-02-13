<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session }) => ({
		props: {
			theme: session.theme.theme
		}
	});
</script>

<script lang="ts">
	import ThemePicker from '$lib/theme-picker.svelte';
	import type { Theme } from '$lib/theme';
	import { browser } from '$app/env';

	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';

	let themes: Theme[] = [
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
		{
			name: 'Solarized Light',
			blk: '#657b83',
			red: '#dc322f',
			grn: '#859900',
			yel: '#b58900',
			blu: '#268bd2',
			mag: '#d33682',
			cya: '#2aa198',
			wht: '#fdf6e3',
			foregroundColor: '#657b83',
			backgroundColor: '#fdf6e3',
			backdrop: '101, 123, 131',
			variant: 'light'
		},
		{
			name: 'Solarized Dark',
			blk: '#839496',
			red: '#ea6962',
			grn: '#a9b665',
			yel: '#d8a657',
			blu: '#7daea3',
			mag: '#d3869b',
			cya: '#89b482',
			wht: '#002b36',
			foregroundColor: '#002b36',
			backgroundColor: '#839496',
			backdrop: '0, 43, 54',
			variant: 'dark'
		},
		{
			name: 'Catpuccin',
			blk: '#111921',
			red: '#F28FAD',
			grn: '#ABE9B3',
			yel: '#FAE3B0',
			blu: '#96CDFB',
			mag: '#DDB6F2',
			cya: '#89DCEB',
			wht: '#C3BAC6',
			foregroundColor: '#C3BAC6',
			backgroundColor: '#111921',
			backdrop: '195, 186, 198',
			variant: 'dark'
		}
	];

	export let theme: string;

	$: {
		if (browser) {
			document.cookie = `theme=${theme}`;
		}
	}

	$: foundT = themes.find((n) => n.name === theme);

	const t = writable(foundT ? foundT : themes[0]);

	$: {
		$t = foundT ? foundT : themes[0];
	}

	setContext('t', t);
</script>

<div
	style="--foreground-color:{$t.foregroundColor};--background-color:{$t.backgroundColor};--blk:{$t.blk};--red:{$t.red};--grn:{$t.grn};--yel:{$t.yel};--blu:{$t.blu};--mag:{$t.mag};--cya:{$t.cya};--wht:{$t.wht};--backdrop:{$t.backdrop}"
>
	<slot />
	<ThemePicker bind:ltheme={theme} bind:themes />
</div>

<style lang="scss">
	:global(html, body, #svelte),
	div {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		color: var(--foreground-color);
		background: var(--background-color);
		transition-duration: 1s, 1s;
		transition-property: background-color, color;
	}
</style>
