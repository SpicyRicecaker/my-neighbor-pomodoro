<script lang="ts">
	export let active: boolean;
</script>

<svg
	on:click
	width="100%"
	height="100%"
	viewBox="0 0 21.883971 18.956333"
	version="1.1"
	id="svg154"
	xmlns="http://www.w3.org/2000/svg"
>
	<defs id="defs151" />
	<g id="layer1" transform="translate(-25.648652,-95.602973)">
		<path
            class:active 
			style="display:inline;fill:none;fill-opacity:1;fill-rule:evenodd;stroke-width:18.8976;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.612813"
			id="path16239"
			transform="matrix(0.00571134,-0.12383225,0.12383225,0.00571134,29.767004,64.122625)"
			d="M -270.02191,67.505482 -391.08421,145.11575 -397.76552,1.4675861 Z"
		/>
	</g>
</svg>

<style>
	svg {
		height: 3rem;
		cursor: pointer;
	}
	path {
		transition: 1s;
		stroke: var(--foreground-color);
	}
	.active {
		stroke: var(--yel);
	}
</style>
