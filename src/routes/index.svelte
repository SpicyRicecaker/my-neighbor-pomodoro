<script lang="ts">
	import { onMount } from 'svelte';
	import audioSrc from '$lib/bell.webm';
	import Triangle from '$lib/triangle.svelte';
	import Ff from '$lib/ff.svelte';
	import Play from '$lib/play.svelte';
	import Pause from '$lib/pause.svelte';
	import Square from '$lib/square.svelte';
	import Triangle from '$lib/triangle.svelte';
	import Circle from '$lib/circle.svelte';

	let running = false;

	$: label = running ? 'stop' : 'start';

	let numWork = 0;

	let config = {
		work: 25,
		shortBreak: 5,
		longBreak: 15
	};

	const setState = (newState: State) => {
		setRunningTo(false);
		state = newState;
		switch (state) {
			case State.Working: {
				timeLeft = config.work * 60 * 1000;
				break;
			}
			case State.ShortBreaking: {
				timeLeft = config.shortBreak * 60 * 1000;
				break;
			}
			case State.LongBreaking: {
				timeLeft = config.longBreak * 60 * 1000;
				break;
			}
		}
	};

	enum State {
		Working,
		ShortBreaking,
		LongBreaking
	}

	const stateSvgArray = [Triangle, Square, Circle];

	const stateLabelArray = ['Working', 'Short break', 'Long break'];

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

	let timerId: any = null;

	const nextState = (playNotification: boolean) => {
		// Also set timer
		switch (state) {
			case State.Working: {
				numWork += 1;
				if (numWork % 4 === 0) {
					state = State.LongBreaking;
					timeLeft = config.longBreak * 60 * 1000;
					if (playNotification) {
						new Notification('time for a long break!');
					}
				} else {
					state = State.ShortBreaking;
					timeLeft = config.shortBreak * 60 * 1000;
					if (playNotification) {
						new Notification('time for a short break!');
					}
				}
				break;
			}
			case State.ShortBreaking:
			case State.LongBreaking: {
				state = State.Working;
				timeLeft = config.work * 60 * 1000;
				if (playNotification) {
					new Notification('time to work!');
				}
				break;
			}
		}
	};

	const updateTiming = (past: Date) => {
		const date = new Date();
		if (running) {
			timeLeft = timeLeft - (date.getTime() - past.getTime());
			if (timeLeft < 0) {
				// play audio
				audio?.play();
				// check if we can send notifications
				const playNotification = notification === 'granted';
				// update state, clock, and give notification
				nextState(playNotification);
				running = false;
			} else {
				timerId = setTimeout(updateTiming, 1000, date);
			}
		}
	};

	let audio: HTMLAudioElement | null = null;

	const setRunningTo = (newRunningState: boolean) => {
		// Always pause audio no matter what
		if (audio) {
			audio.pause();
			audio.currentTime = 0;
		}
		// If our desired new running state is true
		if (newRunningState) {
			// Start a new function
			running = true;
			updateTiming(new Date());
		} else {
			// Otherwise, clear current function and set it to false
			clearTimeout(timerId);
			running = false;
		}
	};

	const toggleRunning = () => setRunningTo(!running);
	const requestNotification = () =>
		Notification.requestPermission().then((permission) => (notification = permission));
</script>

<audio bind:this={audio} src={audioSrc} />
<div class="main">
	<div class="wrapper">
		<div class="option">
			{#each stateSvgArray as s, i}
				<svelte:component this={s} />
				<!-- <div class={state === i ? 'selected' : ''} on:click={() => setState(i)}>
				{label}
			</div> -->
			{/each}
		</div>
		<!-- <div class="state"> -->
		<!-- <div class="state-label">{stateLabel}</div>
			<div class="first" /> -->
		<div class="second"><div>{numWork + 1}</div></div>
		<!-- </div> -->
		<div class="time">
			<!-- {minLeft.toString().padStart(2, '0')}:{secLeft.toString().padStart(2, '0')} -->
			<svg
				width="100%"
				height="100%"
				viewBox="0 0 100 100"
				preserveAspectRatio="xMinYMid meet"
				style="background-color:white"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
			>
				<text x="0" y="80" font-size="90"
					>{minLeft.toString().padStart(2, '0')}:{secLeft.toString().padStart(2, '0')}</text
				>
			</svg>
		</div>
		<div class="state">
			<div class="state-label">{label}</div>
			<!-- <button on:click={toggleRunning} /> -->
			<Play />
			<Pause />
			<div on:click={() => nextState(false)} class="second"><Ff /></div>
		</div>
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
	.option {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		& > div {
			margin: 0 auto;
		}
		& > .selected {
			color: rgb(124, 165, 255);
		}
	}
	.wrapper {
		position: relative;

		align-self: center;
		justify-self: center;

		width: 13rem;
		max-width: 13rem;
		height: 9rem;
		max-height: 9rem;

		overflow: hidden;

		display: grid;
		grid-template-rows: minmax(0, 1fr) minmax(0, 3.5fr) minmax(0, 1fr);
	}
	.main {
		width: 100%;
		height: 100%;
		display: grid;

		grid-template-rows: auto minmax(0, 1fr);

		font-family: Arial, Helvetica, sans-serif;
	}
	.time {
		// font-size: 5.2rem;
		// color: $black;
		& > svg {
			display: block;
			width: 100%;
			height: 100%;
			& > text {
				fill: $black;
			}
		}
	}
	.state {
		// Styling
		font-size: 1rem;

		// Declare the right 1 will always be 2rem, otherwise fill
		display: grid;
		grid-template-columns: auto 2rem;

		// Center the label by self, not each individual container
		position: relative;

		& > .state-label {
			// Answer from user Hashem Qolami at https://stackoverflow.com/a/25776315
			// Centers absolute container
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);

			// Styling
			color: white;

			pointer-events: none;
		}
		& > .first {
			// Styling
			background-color: $black;
		}

		& > .second {
			// Center the number
			display: flex;
			justify-content: center;
			& > div {
				align-self: center;
			}

			// Styling opposite of the rest of the box
			color: $black;
			background-color: white;

			border: 0.05rem inset $black;
		}
	}
	button {
		font-size: 1rem;
		color: white;
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
		&:hover {
			cursor: pointer;
		}
	}
</style>
