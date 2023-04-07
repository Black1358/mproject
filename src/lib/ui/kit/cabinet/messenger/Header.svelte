<script lang="ts">
	import { fly } from "svelte/transition";
	import { backOut } from 'svelte/easing';
	import MoreIcon from "$lib/ui/icons/More.svelte";
	import CloseIcon from "$lib/ui/icons/Close.svelte";
	import BackArrow from "$lib/ui/icons/BackArrow.svelte";
	import Avatar from "$lib/ui/components/Avatar.svelte";
	export let chat;

	let isOpen = false;
	let duration = 300;
	const toggleMenu = () => isOpen = !isOpen;
</script>

<header class="fcc z-30 bgw bor p-2 gap-2 max-w-full" in:fly={{ y: -150, duration, easing: backOut }}>
	<a href="/cabinet/messages" aria-label="Вернуться к всем чатам" class="fcc back-arrow-wrapper">
		<BackArrow size="24" />
	</a>
	<Avatar src={chat?.image} size="32" />
	<div class="f-g1 f-s1 min-w-0 t-cut">
		{#if chat?.name}
			{chat?.name}
		{:else}
			<div class="animate-pulse rounded-md bg-slate-200 h-5 w-60"></div>
		{/if}
	</div>
	<button class="fcc more-icon-wrapper" on:click="{toggleMenu}">
		{#if isOpen}
			<CloseIcon size="24" />
		{:else}
			<MoreIcon size="24" />
		{/if}
	</button>
	{#if isOpen}
		<div class="dropdown-menu absolute top-16 bgw bor p-2" transition:fly="{{ x: 150, duration, easing: backOut }}" >
			<div class="dropdown-item px-4 py-2">Пункт 1</div>
			<div class="dropdown-item px-4 py-2">Пункт 2</div>
			<div class="dropdown-item px-4 py-2">Пункт 3</div>
			<div class="dropdown-item px-4 py-2">Пункт 4</div>
			<div class="dropdown-item px-4 py-2">Пункт 5</div>
		</div>
	{/if}
</header>

<style lang='postcss'>
    .back-arrow-wrapper,.more-icon-wrapper {width: 28px;height: 28px;}
		.dropdown-menu{right:var(--card)}
</style>