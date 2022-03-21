<script lang="ts">
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
			visibleLabel: 'work time',
			content: $config.work.toString(),
			fillerContent: '',
			valid: true
		},
		{
			label: 'shortBreak',
			visibleLabel: 'short break time',
			content: $config.shortBreak.toString(),
			fillerContent: '',
			valid: true
		},
		{
			label: 'longBreak',
			visibleLabel: 'long break time',
			content: $config.longBreak.toString(),
			fillerContent: '',
			valid: true
		}
	];

	$: {
		for (let i = 0; i < inputs.length; i++) {
			if (isValid(inputs[i].content)) {
				inputs[i].valid = true;
				let time = parseInt(inputs[i].content);
				// console.log($config[inputs[i].label], time, inputs[i], inputs, inputs[i].label);
				$config[inputs[i].label] = time;
				inputs[i].fillerContent = `${time} ${time == 1 ? 'minute' : 'minutes'}`;
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

	function isValid(time: string): boolean {
		if (time.length == 0 || time.toString().match(/\D/)) {
			return false;
		} else {
			return true;
		}
	}
</script>

<div class="main">
	<div class="wrapper">
		{#each inputs as field}
			<div class="field">
				<label for={field.label}>{field.visibleLabel}</label>
				<div class="input-unit">
					<input
						tabindex="-1"
						class="overlay"
						class:valid={field.valid}
						bind:value={field.fillerContent}
					/>
					<input
						autocomplete="off"
						placeholder="(time in minutes)"
						class="actual"
						class:valid={field.valid}
						bind:value={field.content}
						id="work"
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
				display: grid;
				grid-template-rows: repeat(3, minmax(0, 1fr));

				& > .input-unit {
					display: grid;
					& input {
						grid-row: 1;
						grid-column: 1;

						border-top: 0;
						border-left: 0;
						border-right: 0;
						outline: none;
						font-size: 2rem;
						transition: 1s;
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
						border: none;

						opacity: 80%;
						pointer-events: none;
						z-index: 1;
					}
				}
			}
		}
	}
</style>
