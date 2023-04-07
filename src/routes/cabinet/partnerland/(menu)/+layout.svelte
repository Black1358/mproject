<script lang="ts">
	import { fly } from 'svelte/transition';
	import { linear } from 'svelte/easing';
	import { page } from '$app/stores';
	let duration = 385;
</script>

<main class="classic">
	<div class='column g-card s-stretch w-full'>
		<div class='flex gap-2'  style='overflow: scroll' in:fly={{ y: -150, duration, easing: linear }} out:fly={{ y: -150, duration: duration - 150, easing: linear }}>
			<a href='/cabinet/partnerland' class='btn-nav' class:active={$page.url.pathname === "/cabinet/partnerland"}>Консоль</a>
			<a href='/cabinet/partnerland/products' class='btn-nav' class:active={$page.url.pathname.startsWith("/cabinet/partnerland/products")}>Товары</a>
			<a href='/cabinet/partnerland/services' class='btn-nav' class:active={$page.url.pathname.startsWith("/cabinet/partnerland/services")}>Услуги</a>
			<a href='/cabinet/partnerland/sets' class='btn-nav' class:active={$page.url.pathname.startsWith("/cabinet/partnerland/sets")}>Наборы</a>
			<a href='/cabinet/partnerland/orders' class='btn-nav' class:active={$page.url.pathname.startsWith("/cabinet/partnerland/orders")}>Заказы</a>
			<a href='/cabinet/partnerland/settings' class='btn-nav' class:active={$page.url.pathname.startsWith("/cabinet/partnerland/settings")}>Настройки</a>
		</div>
		<div class='f-g1'>
			<slot />
		</div>
	</div>
</main>

<style>
	.btn-nav {
		padding: 4px 8px;
		color: black;
		@apply rounded-lg;
	}
	.active {
		background: rgba(0, 0, 0, 0.1);
	}
</style>