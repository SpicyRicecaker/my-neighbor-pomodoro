<script lang="ts">
	import { onMount } from 'svelte';
	import audioSrc from '$lib/bell.webm';
	import Ff from '$lib/actions/ff.svelte';
	import Play from '$lib/actions/play.svelte';
	import Pause from '$lib/actions/pause.svelte';
	// TODO currently very inefficient loading of svgs
	import Square from '$lib/shapes/square.svelte';
	import Triangle from '$lib/shapes/triangle.svelte';
	import Circle from '$lib/shapes/circle.svelte';

	import { config } from '$lib/store';

	import { theme as t } from '$lib/theme';

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
	const stateSvgArray = [
		{
			shape: Triangle
		},
		{
			shape: Square
		},
		{ shape: Circle }
	];

	// Time left in our current state
	let timeLeft: number = $config.work * 60 * 1000;

	// Automatic time
	$: minLeft = Math.floor(timeLeft / (60 * 1000));
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
				timeLeft = $config.work * 60 * 1000;
				break;
			}
			case State.ShortBreaking: {
				timeLeft = $config.shortBreak * 60 * 1000;
				break;
			}
			case State.LongBreaking: {
				timeLeft = $config.longBreak * 60 * 1000;
				break;
			}
		}
	};

	const ensureNextState = () => {
		if (confirm('Are you sure you want to skip the rest of the Pomodoro?')) {
			nextState(false);
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
				setState(State.Working, false);
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
	<div
		class="wrapper"
		id={$t.variant === 'dark' ? 'dark' : ''}
		style="width: {minLeft >= 100 ? '16rem' : '13rem'}"
	>
		<div class="option">
			<div>
				{#each stateSvgArray as s, i}
					<svelte:component
						this={s.shape}
						active={state === i}
						on:click={() => setState(i, true)}
					/>
				{/each}
			</div>
		</div>
		<div class="count"><div>{numWork + 1}</div></div>
		<div class="time">
			<svg
				viewBox="0 0 100 100"
				preserveAspectRatio="xMinYMid meet"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
			>
				<rect />
				<text x="0" y="70" font-size="57"
					>{minLeft.toString().padStart(2, '0')}:{secLeft.toString().padStart(2, '0')}</text
				>
			</svg>
		</div>
		<!-- <div class="state">
			<div class="button">
				{#if running}
					<Pause on:click={toggleRunning} />
				{:else}
					<Play on:click={toggleRunning} />
				{/if}
				<div on:click={ensureNextState}><Ff /></div>
			</div>
		</div> -->
	</div>
</div>
{#if notification !== 'denied' && notification !== 'granted'}
	<div class="link notification" on:click={requestNotification}>
		<svg
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
				d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
			/>
		</svg>
	</div>
{/if}
<a class="link" style="font-size: 1rem;" href="/options">
	<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
		<path
			d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"
		/>
	</svg>
</a>

<style lang="scss">
	@import '../lib/styles.scss';

	#dark {
		box-shadow: 1rem 1.5rem 3rem rgba(var(--backdrop), 0.05);
	}
	.wrapper {
		position: relative;
		align-self: center;
		justify-self: center;

		padding: 1rem 2rem 1rem 2rem;

		border-radius: 1rem;
		// box-shadow: [horizontal offset] [vertical offset] [blur radius] [optional spread radius] [color]
		box-shadow: 1rem 1.5rem 3rem rgba(var(--backdrop), 0.2);

		height: 9rem;
		max-height: 9rem;

		& > .count {
			position: absolute;
			top: 1rem;
			right: 1rem;
			color: var(--foreground-color);
			opacity: 50%;
			user-select: none;
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
		user-select: none;
		& > svg {
			display: block;
			width: 100%;
			height: 100%;
			& > rect {
				width: 200%;
				height: 200%;
				fill: var(--background-color);
				transition: 1s;
			}
			& > text {
				fill: var(--foreground-color);
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
	.notification {
		top: 1.5rem;
		&:hover {
			cursor: pointer;
		}
	}
</style>
