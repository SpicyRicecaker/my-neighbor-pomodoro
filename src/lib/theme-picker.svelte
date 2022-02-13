<script lang="ts">
	import type { Theme } from './theme';

	export let themes: Theme[];
	export let ltheme: string;
</script>

<div id="theme-circle">
	<select name="theme" id="theme" bind:value={ltheme}>
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
