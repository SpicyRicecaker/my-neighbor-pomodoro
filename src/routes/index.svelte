<script lang="ts">
	import { onMount } from 'svelte';
	import audioSrc from '$lib/bell.webm';
	import Ff from '$lib/ff.svelte';
	import Play from '$lib/play.svelte';
	import Pause from '$lib/pause.svelte';
	// TODO currently very inefficient loading of svgs
	import Square from '$lib/square.svelte';
	import Triangle from '$lib/triangle.svelte';
	import Circle from '$lib/circle.svelte';

	let config = {
		work: 0.01,
		shortBreak: 0.2,
		longBreak: 0.2
	};

	let running = false;
	let numWork = 0;

	// State enum, at any given point we can be either working, short breaking, or long breaking
	enum State {
		Working,
		ShortBreaking,
		LongBreaking
	}
	let state: State = State.Working;
	// Array of symbols that represent each state
	const stateSvgArray = [Triangle, Square, Circle];

	// Time left in our current state
	let timeLeft: number = config.work * 60 * 1000;

	// Automatic time
	$: minLeft = Math.floor((timeLeft / (60 * 1000)) % 60);
	$: secLeft = Math.floor((timeLeft / 1000) % 60);

	// Whether notifications have been accepeted by our user or not
	let notification: string;

	onMount(() => {
		// On loading of html, record our notification state (i.e. 'granted', 'denied' as a string)
		notification = Notification.permission;
	});

	// Stores the id of the recursive timer function, should we desire to stop it at any given time
	let timerId: any = null;

	// Function that sets current state to new state
	const setState = (newState: State, userToggled: boolean) => {
		// First disable running
		setRunningTo(false, userToggled);
		// Then set state and remainingtime accordingly
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

	const nextState = (playNotification: boolean) => {
		let notification = '';
		// Also set timer
		switch (state) {
			case State.Working: {
				numWork += 1;
				if (numWork % 4 === 0) {
					setState(State.LongBreaking, false);
					notification = 'time for a long break!';
				} else {
					setState(State.ShortBreaking, false);
					notification = 'time for a break!';
				}
				break;
			}
			case State.ShortBreaking:
			case State.LongBreaking: {
				setState(State.ShortBreaking, false);
				notification = 'time to work!';
				break;
			}
		}
		if (playNotification) {
			new Notification(notification);
		}
	};

	// The core 'game loop' of our clock
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
			} else {
				timerId = setTimeout(updateTiming, 1000, date);
			}
		}
	};

	// Holds the audio element that stores the alarm song
	let audio: HTMLAudioElement | null = null;

	// Set running to a state
	const setRunningTo = (newRunningState: boolean, userToggled: boolean) => {
		// Always pause audio no matter what
		if (userToggled) {
			if (audio) {
				audio.pause();
				audio.currentTime = 0;
			}
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

	// Toggle running
	const toggleRunning = () => setRunningTo(!running, true);

	// Request notification
	const requestNotification = () =>
		Notification.requestPermission().then((permission) => (notification = permission));
</script>

<audio bind:this={audio} src={audioSrc} />
<div class="main">
	<div class="wrapper">
		<div class="option">
			<div>
				{#each stateSvgArray as s, i}
					<svelte:component
						this={s}
						color={state === i ? '400000' : '000000'}
						on:click={() => setState(i, true)}
					/>
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

			align-items: center;
			justify-items: center;
			& > div {
				padding-left: 2rem;
				padding-right: 2rem;
				display: grid;
				grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
			}
		}
	}
	.main {
		width: 100%;
		height: 100%;
		display: grid;

		font-family: Arial, Helvetica, sans-serif;
	}
	.time {
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
