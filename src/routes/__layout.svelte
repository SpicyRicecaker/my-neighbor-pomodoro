<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session }) => {
		return {
			props: {
				theme: session.theme.theme
			}
		};
	};
</script>

<script lang="ts">
	import ThemePicker from '$lib/theme-picker.svelte';
	import { theme as t, selected_theme } from '$lib/theme';

	export let theme: string;

	$selected_theme = theme;
</script>

<div
	style="--foreground-color:{$t.foregroundColor};--background-color:{$t.backgroundColor};--blk:{$t.blk};--red:{$t.red};--grn:{$t.grn};--yel:{$t.yel};--blu:{$t.blu};--mag:{$t.mag};--cya:{$t.cya};--wht:{$t.wht};--backdrop:{$t.backdrop}"
>
	<slot />
	<ThemePicker />
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
