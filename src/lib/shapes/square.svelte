<script lang="ts">
	export let active: boolean;
</script>

<svg
	on:click
	on:keydown
	class:active
	xmlns="http://www.w3.org/2000/svg"
	width="20"
	height="20"
	viewBox="0 0 24 24"
	stroke-width="2"
	fill="none"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<path stroke="none" d="M0 0h24v24H0z" fill="none" />
	<path
		d="M3 14c.83 .642 2.077 1.017 3.5 1c1.423 .017 2.67 -.358 3.5 -1c.83 -.642 2.077 -1.017 3.5 -1c1.423 -.017 2.67 .358 3.5 1"
	/>
	<path d="M8 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
	<path d="M12 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
	<path d="M3 10h14v5a6 6 0 0 1 -6 6h-2a6 6 0 0 1 -6 -6v-5z" />
	<path d="M16.746 16.726a3 3 0 1 0 .252 -5.555" />
</svg>

<style>
	svg {
		cursor: pointer;
		transition: 1s;
		stroke: var(--foreground-color);
	}
	.active {
		stroke: var(--red);
	}
</style>
