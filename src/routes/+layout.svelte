<script lang="ts">
  export let data;
  
  import { theme as t, selected_theme } from "$lib/theme"

  // export let theme: string

  $selected_theme = data.theme

  // import * as pixi from 'pixi.js';
  // import { onMount } from 'svelte';

  // onMount(() => {
  // 	let app = new pixi.Application({ width: 640, height: 360 });

  // 	document.body.appendChild(app.view);
  // });
</script>

<div
  style="--foreground-color:{$t.foregroundColor};--background-color:{$t.backgroundColor};--blk:{$t.blk};--red:{$t.red};--grn:{$t.grn};--yel:{$t.yel};--blu:{$t.blu};--mag:{$t.mag};--cya:{$t.cya};--wht:{$t.wht};--backdrop:{$t.backdrop}"
>
  <slot />
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
