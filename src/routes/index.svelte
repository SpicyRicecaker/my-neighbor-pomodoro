<script lang="ts">
	import { onMount } from 'svelte';
	import audioSrc from '$lib/bell.webm';
	import Ff from '$lib/ff.svelte';
	import Play from '$lib/play.svelte';
	import Pause from '$lib/pause.svelte';
	import Square from '$lib/square.svelte';
	import Triangle from '$lib/triangle.svelte';
	import Circle from '$lib/circle.svelte';

	let running = false;

	// $: label = running ? 'stop' : 'start';

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

	// const stateLabelArray = ['Working', 'Short break', 'Long break'];

	let state: State = State.Working;
	// $: stateLabel = stateLabelArray[state];

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

	// 	<!-- <div class={state === i ? 'selected' : ''} on:click={() => setState(i)}>
	// 	{label}
	// </div> -->
</script>

<audio bind:this={audio} src={audioSrc} />
<div class="main">
	<div class="wrapper">
		<div class="option">
			<div>
				{#each stateSvgArray as s, i}
					<svelte:component this={s} color={state === i ? '400000' : '000000'} on:click={() => setState(i)}/>
				{/each}
			</div>
		</div>
		<div class="count"><div>{numWork + 1}</div></div>
		<div class="time">
			<svg
				width="100%"
				height="100%"
				viewBox="0 0 100 100"
				preserveAspectRatio="xMinYMid meet"
				style="background-color:white"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
			>
				<text x="0" y="70" font-size="57"
					>{minLeft.toString().padStart(2, '0')}:{secLeft.toString().padStart(2, '0')}</text
				>
			</svg>
		</div>
		<div class="state">
			<div class="button">
				{#if running}
					<Pause on:click={toggleRunning} />
				{:else}
					<Play on:click={toggleRunning} />
				{/if}
				<div on:click={() => nextState(false)}><Ff /></div>
			</div>
			<!-- <div class="state-label">{label}</div> -->
			<!-- <button on:click={toggleRunning} /> -->
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

	.wrapper {
		position: relative;
		align-self: center;
		justify-self: center;

		padding: 1rem 2rem 1rem 2rem;

		border-radius: 1rem;
		// box-shadow: [horizontal offset] [vertical offset] [blur radius] [optional spread radius] [color]
		box-shadow: 1rem 1.5rem 3rem #00000025;

		width: 13rem;
		max-width: 13rem;
		height: 9rem;
		max-height: 9rem;

		& > .count {
			position: absolute;
			top: 1rem;
			right: 1rem;
			color: $black;
			opacity: 50%;
		}

		& > .option {
			position: absolute;
			top: -45%;
			left: 0;

			width: 100%;
			// max-width: 13rem;

			align-items: center;
			justify-items: center;
			& > div {
				padding-left: 2rem;
				padding-right: 2rem;
				display: grid;
				grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
			}

			& > * {
				align-self: center;
				justify-self: center;
			}
			// width: 5rem;

			// display: grid;
			// grid-template-columns: 1fr 1fr 1fr;
			& > .selected {
				color: rgb(124, 165, 255);
			}
		}
	}
	.main {
		width: 100%;
		height: 100%;
		display: grid;

		// grid-template-rows: auto minmax(0, 1fr);

		font-family: Arial, Helvetica, sans-serif;
	}
	.time {
		// font-size: 5.2rem;
		// color: $black;
		width: 100%;
		height: 100%;
		& > svg {
			display: block;
			width: 100%;
			height: 100%;
			& > text {
				fill: $black;
				opacity: 70%;
			}
		}
	}
	.state {
		// Styling
		font-size: 1rem;

		// Declare the right 1 will always be 2rem, otherwise fill

		// Center the label by self, not each individual container
		position: absolute;

		top: 130%;
		left: 0;
		width: 100%;

		display: grid;

		& > .button {
			align-self: center;
			justify-self: center;
			position: relative;
			&:hover {
				cursor: pointer;
			}
			& > div {
				position: absolute;
				top: 0;
				left: 150%;
			}
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
