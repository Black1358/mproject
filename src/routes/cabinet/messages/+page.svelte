<script lang="ts">
	import {fly} from 'svelte/transition';
	import {backOut} from 'svelte/easing';
	import {page} from "$app/stores";
	let duration = $page.data.animation;
	let metaTitle = $page.data.metaTitle;
	let metaDesc = $page.data.metaDesc;
</script>

<svelte:head>
	<title>{metaTitle}</title>
	<meta name="description" content={metaDesc} />
</svelte:head>

<div class='column max-w-full' in:fly={{ x: 150, duration, easing: backOut }}>
	<h1>Выберите чат</h1>
</div>