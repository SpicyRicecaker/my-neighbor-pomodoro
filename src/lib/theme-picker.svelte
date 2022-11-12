<script lang="ts">
	import { browser } from '$app/environment';
	// import { session } from '$app/stores';

	import { selected_theme, themes } from './theme';

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

	let visible = false;

	function setInvisible(e: MouseEvent) {
		if (!(e.target as HTMLElement).closest('#theme-circle')) {
			visible = false;
			document.removeEventListener('click', setInvisible);
		}
	}
	function toggleVisible() {
		visible = !visible;
		if (visible) {
			document.addEventListener('click', setInvisible);
		}
	}
</script>

<div id="theme-circle">
	<svg
		on:click={toggleVisible}
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
	<div id="theme-menu" style="display:{visible ? 'grid' : 'none'}">
		{#each themes as theme}
			<div>
				<button
					id={theme.name}
					name="theme"
					class="theme-option"
					on:click={() => {
						$selected_theme = theme.name;
					}}
					style="color:{theme.name === $selected_theme ? 'var(--yel)' : ''}"
				>
					{theme.name}
				</button>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	#theme-circle {
		& #theme-menu {
			position: absolute;
			opacity: 80%;
			top: 3rem;
			left: 1rem;

			& > div > button {
				font-family: Arial, Helvetica, sans-serif;
				// get rid of default button styling
				border: none;
				font-size: 1rem;
				font-family: Arial, Helvetica, sans-serif;
				text-decoration: none;

				// make button take up whole span so that we can enable hover
				padding: 0rem 0.5rem 0.8em 0;
				text-align: left;
				width: 100%;

				// color as normal `a` tag
				background-color: var(--background-color);
				color: var(--foreground-color);

				transition: color 1s, background-color 1s;
				&:hover {
					cursor: pointer;
				}
			}
		}

		& > svg {
			position: absolute;
			top: 1rem;
			left: 1rem;
			opacity: 80%;

			&:hover {
				cursor: pointer;
			}
		}
	}
</style>
