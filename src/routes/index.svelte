<script lang="ts">
	import { onMount } from 'svelte';

	let running = false;

	$: label = running ? 'stop' : 'start';

	let numWork = 0;

	let config = {
		work: 0.1,
		shortBreak: 0.1,
		longBreak: 0.1
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

	onMount(() => {
		timeLeft = config.work * 60 * 1000;
	});

	const updateTiming = (past: Date) => {
		const date = new Date();
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
		} else if (running) {
			setTimeout(updateTiming, 1000, date);
		}
	};

	const toggleRunning = () => {
		// Turn to pause
		running = !running;
		updateTiming(new Date());
	};
</script>

<div>{stateLabel} - {numWork + 1}</div>
<div>{timeLeft} ms</div>
<button on:click={toggleRunning}>{label}</button>
