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

	const MILLIS_IN_SECOND = 60 * 1000;

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
	let timeLeft: number = $config.work * MILLIS_IN_SECOND;

	// Automatic time
	$: minLeft = Math.floor(timeLeft / MILLIS_IN_SECOND);
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
				timeLeft = $config.work * MILLIS_IN_SECOND;
				break;
			}
			case State.ShortBreaking: {
				timeLeft = $config.shortBreak * MILLIS_IN_SECOND;
				break;
			}
			case State.LongBreaking: {
				timeLeft = $config.longBreak * MILLIS_IN_SECOND;
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
		console.log('Playing notification');
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

	const handleKey = (e: KeyboardEvent) => {
		if (e.code === 'Space') {
			toggleRunning();
		}
	};
</script>

<svelte:window
	on:keydown={(e) => {
		handleKey(e);
	}}
/>
<audio bind:this={audio} src={audioSrc} />
<div class="main">
	<div class="wrapper" id={$t.variant === 'dark' ? 'dark' : ''}>
		<div class="option">
			<div>
				{#each stateSvgArray as s, i}
					<div>
						<svelte:component
							this={s.shape}
							active={state === i}
							on:click={() => setState(i, true)}
						/>
					</div>
				{/each}
			</div>
		</div>
		<div class="time">
			{minLeft.toString().padStart(2, '0')}:{secLeft.toString().padStart(2, '0')}
		</div>
		<div class="state">
			<div>
				<div class="count"><div>{numWork + 1}</div></div>
				<div class="button">
					{#if running}
						<Pause on:click={toggleRunning} />
					{:else}
						<Play on:click={toggleRunning} />
					{/if}
				</div>
				<div class="next" on:click={ensureNextState} on:keydown={ensureNextState}><Ff /></div>
			</div>
		</div>
	</div>
</div>
{#if notification !== 'denied' && notification !== 'granted'}
	<div class="link notification" on:click={requestNotification} on:keydown={requestNotification}>
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
	<svg
		width="20"
		height="20"
		xmlns="http://www.w3.org/2000/svg"
		class="h-5 w-5"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path
			d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"
		/>
	</svg>
</a>

<style lang="scss">
	@import '../lib/styles.scss';

	.wrapper {
		width: 100%;
		height: 100%;
		position: relative;
		align-self: center;
		justify-self: center;

		max-height: 15rem;

		display: grid;
		grid-template-columns: minmax(0, 1fr), minmax(0, 5fr), minmax(0, 1fr);

		& > .option {
			width: 100%;

			display: flex;
			align-items: center;
			justify-content: center;

			& > div {
				width: 30%;

				display: grid;
				grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);

				& > * {
					display: flex;
					justify-content: center;
				}
			}
		}
	}

	.main {
		width: 100%;
		height: 100%;

		display: grid;

		font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial,
			sans-serif;
	}

	.time {
		user-select: none;
		font-size: 5rem;
		display: grid;
		align-items: center;
		justify-content: center;
	}

	.state {
		width: 100%;
		// Styling
		font-size: 1rem;

		// Declare the right 1 will always be 2rem, otherwise fill
		// Center the label by self, not each individual container

		display: flex;
		justify-content: center;

		& > div {
			width: 30%;

			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);

			& > * {
				align-self: center;
				justify-self: center;
			}

			& > .button,
			.next {
				&:hover {
					cursor: pointer;
				}
			}

			& > .count {
				font-size: 0.9rem;
				color: var(--foreground-color);
				user-select: none;
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
