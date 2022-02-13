<script lang="ts">
	import { theme, themes, themeName } from '$lib/theme';
	function doStuff(e: Event) {
		e.preventDefault();
		e.stopPropagation();
	}
	import { onMount } from 'svelte';

	let root: HTMLElement;
	let updateThemeOnIndex = (_: string) => {};

	$: updateThemeOnIndex($themeName);
	onMount(() => {
		root = document.documentElement;
		updateThemeOnIndex = (_: string) => {
			root.style.setProperty('--blk', $theme.blk);
			root.style.setProperty('--red', $theme.red);
			root.style.setProperty('--grn', $theme.grn);
			root.style.setProperty('--yel', $theme.yel);
			root.style.setProperty('--blu', $theme.blu);
			root.style.setProperty('--mag', $theme.mag);
			root.style.setProperty('--cya', $theme.cya);
			root.style.setProperty('--wht', $theme.wht);
			root.style.setProperty('--foreground-color', $theme.foregroundColor);
			root.style.setProperty('--background-color', $theme.backgroundColor);
			root.style.setProperty('--backdrop', $theme.backdrop);
			// root.style.setProperty('--variant', $theme.variant);
		};
	});
</script>

<div id="theme-circle">
	<select name="theme" id="theme" bind:value={$themeName} on:click={(e) => doStuff(e)}>
		{#each themes as theme}
			<option value={theme.name} label={theme.name} />
		{/each}
	</select>
</div>

<style lang="scss">
	#theme {
		background-color: var(--background-color);
		color: var(--foreground-color);
		outline: none;
		position: absolute;
		top: 1rem;
		left: 1rem;
		transition: 1s;
		// display: none;
	}
	#theme-circle {
		display: flex;
		// text-align: center;
		& > #theme {
			// Style
			border-radius: 0;
			border: 0;
			padding: 0.2rem;
			appearance: none;
			// Animation
			// Font
			font-size: 1rem;
		}
	}
</style>
