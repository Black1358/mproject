<script lang="ts">
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.data.metaTitle}</title>
	<meta name="description" content={$page.data.metaDesc} />
</svelte:head>

<main class="classic" in:fly={{ x: 150, duration: $page.data.animation, easing: backOut }}>
	<div class='page gap-2'>
		<h1>Давно пора!</h1>
		<a class='btn btn-secondary' href='/become-partner/registration'>Стать партнёром</a>
	</div>
</main>