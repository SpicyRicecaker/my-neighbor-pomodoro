<script lang="ts">
	import ThemePicker from '$lib/theme-picker.svelte';
	import { config } from '$lib/store';

	interface Field {
		label: string;
		visibleLabel: string;
		content: string;
		fillerContent: string;
		valid: boolean;
	}

	let inputs: Field[] = [
		{
			label: 'work',
			visibleLabel: 'work',
			content: $config.work.toString(),
			fillerContent: '',
			valid: true
		},
		{
			label: 'shortBreak',
			visibleLabel: 'short break',
			content: $config.shortBreak.toString(),
			fillerContent: '',
			valid: true
		},
		{
			label: 'longBreak',
			visibleLabel: 'long break',
			content: $config.longBreak.toString(),
			fillerContent: '',
			valid: true
		}
	];

	$: {
		for (let i = 0; i < inputs.length; i++) {
			let time = parseFloat(inputs[i].content);
			if (!isNaN(time) && isFinite(inputs[i].content as unknown as number)) {
				inputs[i].valid = true;
				// console.log($config[inputs[i].label], time, inputs[i], inputs, inputs[i].label);
				$config[inputs[i].label] = time;
				inputs[i].fillerContent = `${inputs[i].content} ${time == 1 ? 'min' : 'min'}`;
			} else {
				inputs[i].valid = false;
				let string: string = '';
				if (inputs[i].content.length == 0) {
					string = '';
				} else {
					string = `${inputs[i].content} is not a number!`;
				}
				inputs[i].fillerContent = string;
			}
		}
	}

	// function isValid(time: string): boolean {
	// 	if (time.length == 0 || time.toString().match(/\D/)) {
	// 		return false;
	// 	} else {
	// 		return true;
	// 	}
	// }
</script>

<div class="main">
	<div class="wrapper">
		{#each inputs as field}
			<div class="field">
				<div class="input-unit">
					<label for={field.label}>{field.visibleLabel}</label>
					<input
						size="10"
						tabindex="-1"
						class="overlay"
						class:valid={field.valid}
						bind:value={field.fillerContent}
						type="text"
					/>
					<input
						size="10"
						id={field.label}
						autocomplete="off"
						placeholder="(time in minutes)"
						class="actual"
						class:valid={field.valid}
						bind:value={field.content}
						type="text"
					/>
				</div>
			</div>
		{/each}
	</div>
</div>

<a class="link" href="/"
	><svg
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
			d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
		/>
	</svg></a
>

<ThemePicker />

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
			// grid-template-columns: minmax(0, 1fr);
			grid-template-rows: repeat(3, minmax(0, 1fr));
			& > .field {
				color: var(--foreground-color);
				opacity: 80%;
				// display: grid;
				// grid-template-rows: repeat(3, minmax(0, 1fr));

				& label {
					font-size: 1rem;
					text-align: left;
					opacity: 80%;

					padding-left: 1px;
					border-left: 1px transparent black;
				}
				& > .input-unit {
					display: grid;
					& input {
						padding-bottom: 0;

						grid-row: 1;
						grid-column: 1;

						border-top: 0;
						border-left: 0;
						border-right: 0;
						outline: none;
						font-size: 2rem;

						min-width: none;

						transition: border-color 1s, background-color 1s;

						background-color: var(--background-color);
						color: var(--foreground-color);

						&.actual {
							border-color: var(--red);

							&.valid {
								border-color: var(--background-color);
								&:focus {
									border-color: var(--grn);
								}
							}
						}
					}
					& > .overlay {
						background: none;
						border-color: #00000000;

						opacity: 80%;
						pointer-events: none;
						z-index: 1;
					}
				}
			}
		}
	}
</style>
