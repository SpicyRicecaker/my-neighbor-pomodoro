<script lang="ts">
	import { onMount } from 'svelte';

	let running = false;

	$: label = running ? 'stop' : 'start';

	let numWork = 0;

	let config = {
		work: 25,
		shortBreak: 5,
		longBreak: 15
	};

	enum State {
		Working,
		ShortBreaking,
		LongBreaking
	}

	const stateLabelArray = ['Working', 'Short Break', 'Long Break'];

	let state: State = State.Working;
	$: stateLabel = stateLabelArray[state];

	let timeLeft: number = 0;

	$: minLeft = Math.floor((timeLeft / (60 * 1000)) % 60);
	$: secLeft = Math.floor((timeLeft / 1000) % 60);

	onMount(() => {
		timeLeft = config.work * 60 * 1000;
	});

	const updateTiming = (past: Date) => {
		const date = new Date();
		if (running) {
			timeLeft = timeLeft - (date.getTime() - past.getTime());
			if (timeLeft < 0) {
				switch (state) {
					case State.Working: {
						numWork += 1;
						if (numWork % 4 === 0) {
							state = State.LongBreaking;
							timeLeft = config.longBreak * 60 * 1000;
						} else {
							state = State.ShortBreaking;
							timeLeft = config.shortBreak * 60 * 1000;
						}
						break;
					}
					case State.ShortBreaking:
					case State.LongBreaking: {
						state = State.Working;
						timeLeft = config.work * 60 * 1000;
						break;
					}
				}
				running = false;
				// Also set timer
			} else {
				setTimeout(updateTiming, 1000, date);
			}
		}
	};

	const toggleRunning = () => {
		// Turn to pause
		running = !running;
		updateTiming(new Date());
	};
</script>

<div class="main">
	<div class="wrapper">
		<div class="state">
			<div class="first">{stateLabel}</div>
			<div class="second">{numWork + 1}</div>
		</div>
		<div class="time">{minLeft}:{secLeft}</div>
		<button on:click={toggleRunning}>{label}</button>
	</div>
</div>

<style lang="scss">
	$black: #292828;

	:global(html, body, #svelte) {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
	}
	.wrapper {
		align-self: center;
		justify-self: center;
		display: grid;
	}
	.main {
		width: 100%;
		height: 100%;
		display: grid;

		font-family: Arial, Helvetica, sans-serif;
	}
	.time {
		font-size: 5rem;
		color: $black;
	}
	.state {
		font-size: 1rem;
		align-self: center;
		justify-self: center;
		display: flex;
		& > .first {
			color: white;
			background-color: $black;
			padding: 0.2rem 2rem;
			flex: 1;
		}
		& > .second {
			color: $black;
			background-color: white;
			padding: 0.2rem 1rem;
			flex: 0;
		}
	}
	button {
		font-size: 1rem;
		padding: 0.2rem 1rem;
		color: white;
		background-color: $black;
		border: none;
		outline: none;
		&:hover {
			cursor: pointer;
		}
		// background-color: transparent;
	}
</style>
