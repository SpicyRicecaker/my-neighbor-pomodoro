<script lang="ts">
	import { browser } from '$app/env';
	import { session } from '$app/stores';

	import { selected_theme, themes } from './theme';

	function updateCookie(new_theme: string) {
		if (browser && new_theme) {
			const daysToExpire = new Date(2147483647 * 1000).toUTCString();

			document.cookie = `theme=${new_theme};SameSite=None;Secure;Path=/;Expires=${daysToExpire}`;
			console.log('setting cookie');
			// trigger new load functions to actually interpret this cookie change
			$session.user = {};
		}
	}
	$: updateCookie($selected_theme);
</script>

<div id="theme-circle">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="h-6 w-6"
		fill="none"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="2"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
		/>
	</svg>
	<!-- <select name="theme" id="theme" bind:value={$selected_theme}>
		{#each themes as theme}
			<option value={theme.name} label={'◯'}/>
		{/each}
	</select> -->
</div>

<style lang="scss">
	#theme-circle {
		display: flex;
		// text-align: center;
		& > svg {
			// Style
			border-radius: 0;
			border: 0;
			// padding: 0.2rem;
			appearance: none;
			opacity: 80%;
			// Animation
			// Font
			font-size: 1rem;

			-webkit-appearance: none;
			background-color: var(--background-color);
			color: var(--foreground-color);
			outline: none;
			position: absolute;
			top: 1rem;
			left: 1rem;
			transition: 1s;
			// display: none;
		}
	}
</style>
