<script lang="ts">
	import { config } from '$lib/store';
</script>

<div class="main">
	<div class="wrapper">
		<div>
			<label for="work">work time</label>
			<input bind:value={$config.work} id="work" type="text" />
		</div>
		<div>
			<label for="short-break">short break</label>
			<input bind:value={$config.shortBreak} id="short-break" type="text" />
		</div>
		<div>
			<label for="long-break">long break</label>
			<input bind:value={$config.longBreak} id="long-break" type="text" />
		</div>
	</div>
</div>

<a class="link" href="/">back</a>

<style lang="scss">
	@import '../lib/styles.scss';

	.main {
		font-family: Arial, Helvetica, sans-serif;
		font-size: 2rem;
		width: 100%;
		height: 100%;
		display: grid;
		& > .wrapper {
			align-self: center;
			justify-self: center;
			display: grid;
			gap: 2rem;
			& > div {
				color: $black;
				opacity: 80%;
				display: grid;
				& > input {
					border-top: 0;
					border-left: 0;
					border-right: 0;
					outline: none;
					font-size: 2rem;
					transition: 0.4s;
					&:focus {
						border-color: rgba(178, 53, 53, 0.656);
					}
				}
			}
		}
	}
</style>
