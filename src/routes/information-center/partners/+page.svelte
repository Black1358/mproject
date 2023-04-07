<script lang="ts">
	import {fly} from 'svelte/transition';
	import {backOut} from 'svelte/easing';
	import {page} from "$app/stores";
	$: duration = $page.data.animation || 300;
	$: metaTitle = $page.data.metaTitle || "Мастерская подарков";
	$: metaDesc = $page.data.metaDesc  || "Мастерская подарков";
</script>

<svelte:head>
	<title>{metaTitle}</title>
	<meta name="description" content={metaDesc} />
</svelte:head>

<main class="classic fcc" in:fly={{ x: 150, duration, easing: backOut }}>
	<div class='column max-w-full'>
		<h1>Добро пожаловать!</h1>
	</div>
</main>