<script lang="ts">
	import { browser } from '$app/env';
	// import { session } from '$app/stores';

	// import type { Theme } from './theme';
	import { selected_theme, themes } from './theme';

	// export let themes: Theme[];
	// export let ltheme: string;

	function updateCookie(new_theme: string) {
		if (browser && new_theme) {
			const daysToExpire = new Date(2147483647 * 1000).toUTCString();

			document.cookie = `theme=${new_theme};SameSite=None;Secure;Path=/;Expires=${daysToExpire}`;
			console.log('setting cookie');
			// trigger new load functions to actually interpret this cookie change
			// $session.user = {};
		}
	}
	$: updateCookie($selected_theme);
</script>

<div id="theme-circle">
	<select name="theme" id="theme" bind:value={$selected_theme}>
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
