<script lang="ts">
	import { fly } from 'svelte/transition';
	import { backOut} from 'svelte/easing';
	import { page } from "$app/stores";

	let metaTitle, metaDesc;

	if ($page.status === 404) {
		metaTitle = "404 - Мастерская Подарков";
		metaDesc = "Упс! Кажется, такой страницы больше нет. Ищете подарок с душой? Загляните в Мастерскую Подарков - лучший выбор товаров ручной работы от талантливых мастеров🎨";
	} else {
		metaTitle = "Технические работы - Мастерская Подарков";
		metaDesc = "Ведутся технические работы. Мы делаем нашу платформу еще лучше для вас. Пожалуйста, зайдите позже и откройте новые возможности Мастерской Подарков🚀";
	}
</script>

<svelte:head>
	<title>{metaTitle}</title>
	<meta name="description" content={metaDesc} />
</svelte:head>

<main class="header pt-3" in:fly={{ x: 150, duration: $page.data.animation, easing: backOut }}>
	<div class='page v-center'>
		<h1>{$page.status}</h1>
		{#if $page.status === 404}
			<p>Страница не найдена</p>
		{:else}
			<p>Ведутся технические работы</p>
		{/if}
	</div>
</main>