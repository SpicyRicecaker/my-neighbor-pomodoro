<script lang="ts">
	import { onMount } from 'svelte';
	import audioSrc from '$lib/bell.webm';

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

	const stateLabelArray = ['working', 'Short break', 'Long break'];

	let state: State = State.Working;
	$: stateLabel = stateLabelArray[state];

	let timeLeft: number = 0;

	$: minLeft = Math.floor((timeLeft / (60 * 1000)) % 60);
	$: secLeft = Math.floor((timeLeft / 1000) % 60);

	let notification: string;

	onMount(() => {
		timeLeft = config.work * 60 * 1000;
		// load notification
		notification = Notification.permission;
	});

	const updateTiming = (past: Date) => {
		const date = new Date();
		if (running) {
			timeLeft = timeLeft - (date.getTime() - past.getTime());
			if (timeLeft < 0) {
				// play audio
				audio?.play();
				// send notification if we should
				switch (state) {
					case State.Working: {
						numWork += 1;
						if (numWork % 4 === 0) {
							state = State.LongBreaking;
							timeLeft = config.longBreak * 60 * 1000;
							if (notification === 'granted') {
								new Notification('time for a long break!');
							}
						} else {
							state = State.ShortBreaking;
							timeLeft = config.shortBreak * 60 * 1000;
							if (notification === 'granted') {
								new Notification('time for a short break!');
							}
						}
						break;
					}
					case State.ShortBreaking:
					case State.LongBreaking: {
						state = State.Working;
						timeLeft = config.work * 60 * 1000;
						if (notification === 'granted') {
							new Notification('time to work!');
						}
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

	let audio: HTMLAudioElement | null = null;

	const toggleRunning = () => {
		if (audio) {
			audio.pause();
			audio.currentTime = 0;
		}
		// stop all playing audio
		// reset its time to 0
		running = !running;
		updateTiming(new Date());
	};

	const requestNotification = () =>
		Notification.requestPermission().then((permission) => (notification = permission));
</script>

<audio bind:this={audio} src={audioSrc} />
<div class="main">
	<div class="wrapper">
		<div class="state">
			<div class="first">{stateLabel}</div>
			<div class="second">{numWork + 1}</div>
		</div>
		<div class="time">
			{minLeft.toString().padStart(2, '0')}:{secLeft.toString().padStart(2, '0')}
		</div>
		<button on:click={toggleRunning}>{label}</button>
	</div>
</div>
{#if notification !== 'denied' && notification !== 'granted'}
	<div class="notification-bell" on:click={requestNotification}>notify me</div>
{/if}

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
		display: flex;
		& > .first {
			color: white;
			background-color: $black;
			text-align: center;
			padding-top: 0.2rem;
			padding-bottom: 0.2rem;
			flex: 1;
		}
		& > .second {
			color: $black;
			background-color: white;
			padding: 0.2rem 0.5rem;
			flex: 0;
		}
	}
	button {
		font-size: 1rem;
		color: white;
		padding-top: 0.2rem;
		padding-bottom: 0.2rem;
		background-color: $black;
		border: none;
		outline: none;
		&:hover {
			cursor: pointer;
		}
	}

	.notification-bell {
		font-family: Arial, Helvetica, sans-serif;
		position: absolute;
		top: 0;
		right: 0;
		margin: 1rem;
	}
</style>
