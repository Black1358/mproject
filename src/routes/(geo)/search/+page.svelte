<script lang='ts'>
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.data.metaTitle}</title>
	<meta name='description' content={$page.data.metaDesc} />
</svelte:head>

<main class="header pt-3" in:fly={{ x: 150, duration: $page.data.animation, easing: backOut }}>
	<div class='page'>
		<h1>Поиск</h1>
	</div>
</main>