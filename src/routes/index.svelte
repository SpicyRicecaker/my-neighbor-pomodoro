<script lang="ts">
	import { onMount } from 'svelte';

	let running = false;

	$: label = running ? 'stop' : 'start';

	let numWork = 0;

	let config = {
		work: 0.1,
		shortBreak: 5,
		longBreak: 15
	};

	enum State {
		Working,
		ShortBreaking,
		LongBreaking
	}

	let state: State = State.Working;

	let timeLeft: number = 0;

	onMount(() => {
		timeLeft = config.work * 60 * 1000;
	});

	const updateTiming = (past: Date) => {
		let date = new Date();
		timeLeft = timeLeft - (date.getTime() - past.getTime());
		if (timeLeft < 0) {
			switch (state) {
				case State.Working: {
					numWork += 1;
					if (numWork === 4) {
						state = State.LongBreaking;
					}
					break;
				}
				case State.ShortBreaking:
				case State.LongBreaking: {
					state = State.Working;
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

<div>{timeLeft} ms</div>
<button on:click={toggleRunning}>{label}</button>
