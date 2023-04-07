<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { page } from "$app/stores";
	import ProductCard from '$lib/ui/components/ProductCard.svelte';
	let currentPage = 1, isLoading = false
	$: hasMoreProducts = $page.data.totalPages > currentPage;
	$: vendor = JSON.parse($page.data.vendor);
	$: products = JSON.parse($page.data.products);
	const loadMoreProducts = async () => {
		if (!isLoading && hasMoreProducts) {
			isLoading = true;
			currentPage++;
			const res = await fetch(`/api/partner/products?page=${currentPage}&vendor=${vendor.id}`);
			const data = await res.json();
			if (data.length > 0) products = [...products, ...data];
			else hasMoreProducts = false;
			isLoading = false;
		}
	};
	onMount(() => {loadMoreProducts();});
</script>

<svelte:head>
	<title>{$page.data.metaTitle}</title>
	<meta name="description" content={$page.data.metaDesc} />
</svelte:head>

<svelte:window on:scroll={() => {if (window.innerHeight + window.scrollY + 500 >= document.body.offsetHeight && !isLoading && hasMoreProducts) loadMoreProducts()}} />

<main class="header pt-3" in:fly={{ x: 150, duration: $page.data.animation, easing: backOut }}>
	<div class='fccc s-stretch g-card max-w-full'>
			<div class='column partner-header w-full'>
				<div class='flex'>
					<div class='f-g1'></div>
					<div class='flex bg-white bor rounded-tl-3xl rounded-tr-3xl p-card pb-0 partner' style='border-bottom: 0px #eee solid'>
						<div class='fcc'>
							<img width="100" height="100" src={`http://127.0.0.1:8090/api/files/vendors/${vendor.id}/${vendor.logo}`} alt={`${vendor.name} логотип`}>
						</div>
						<div class='column'>
							<h1>{vendor.name}</h1>
							<p>{vendor.desc}</p>
						</div>
					</div>
					<div class='f-g1'></div>
				</div>
				<div class='bg-white flex p-card g-card rounded-lg'>
					<div>Товары</div>
					<div>Услуги</div>
					<div>Блог</div>
				</div>
			</div>
			<ul class='product-list'>
				{#each products as product}
					<ProductCard {product} />
				{/each}
				{#each products as product}
					<ProductCard {product} />
				{/each}
				{#each products as product}
					<ProductCard {product} />
				{/each}
				{#each products as product}
					<ProductCard {product} />
				{/each}
			</ul>
	</div>
</main>

{#if isLoading}Загрузка{/if}

<style>
		.partner-header{
				margin-top: var(--b-card);

		}
		.partner {padding-bottom: 0}
	.logo {
      border-top: 1px #eee solid;
      @apply rounded-full;
			transform: translateY(-50%);
	}
	.logo img {
			border: 5px white solid;
			@apply rounded-full;
	}
</style>