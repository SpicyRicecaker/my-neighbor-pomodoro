<slot />

<style lang="scss">
	:global(html, body, #svelte) {
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
