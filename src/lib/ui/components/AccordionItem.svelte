<script lang="ts">
	import {slide} from 'svelte/transition';
	export let header = "";
	export let body = "";
	let isOpen = false;
</script>

<div>
	<div class="acc-header bgw rounded-lg gap-3 flex v-center pointer" tabindex="0" role="tab" aria-expanded={isOpen} on:click={() => {isOpen = !isOpen}} on:keypress={() => {isOpen = !isOpen}}>
		<div class="f-g1">{@html header}</div>
		<div class="toggle-acc pointer" class:active={isOpen}></div>
	</div>
	{#if isOpen}
		<p class="accordion__body" transition:slide>{@html body}</p>
	{/if}
</div>

<style>
    .acc-header {padding:9px var(--pd);position:relative;min-height:70px}
    .acc-header:focus-visible{outline: 2px var(--accent-el) solid}
    .toggle-acc{
				flex-shrink:0;width:40px;height:40px;-webkit-transition:all .15s ease;-o-transition:all .15s ease;transition:all .15s linear;
				background-image:url("data:image/svg+xml,%3Csvg width='44' height='44' viewBox='0 0 44 44' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle r='22' transform='matrix(-1.19249e-08 1 1 1.19249e-08 22 22)' fill='%23fff'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M30.0847 20.9153L22 29L21.9998 28.9998L21.9996 28.9999L13.9148 20.9152C13.4093 20.4097 13.4093 19.5902 13.9148 19.0847C14.4203 18.5792 15.2398 18.5792 15.7453 19.0847L21.9998 25.3392L28.2542 19.0847C28.7597 18.5793 29.5793 18.5793 30.0847 19.0847C30.5902 19.5902 30.5902 20.4098 30.0847 20.9153Z' fill='%238B5D42'/%3E%3C/svg%3E");background-repeat:no-repeat;background-size:contain
    }
    .toggle-acc.active{transform:rotate(180deg)}
    .accordion__body{margin: 14px}
</style>