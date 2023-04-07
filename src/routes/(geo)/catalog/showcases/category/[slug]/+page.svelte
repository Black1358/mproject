<script lang="ts">
	import { Add } from '$lib/ui/icons';
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { page } from "$app/stores";

	import ProductCard from "$lib/ui/components/ProductCard.svelte";

	$: duration = $page.data.animation || 300;
	$: metaTitle = $page.data.metaTitle || "Мастерская подарков";
	$: metaDesc = $page.data.metaDesc  || "Мастерская подарков";

	$: category = $page.data.category ? JSON.parse($page.data.category.toString()) : [];
	$: childs = $page.data.childs ? JSON.parse($page.data.childs.toString()) : [];
	$: products = $page.data.products ? JSON.parse($page.data.products.toString()) : [];
</script>

<svelte:head>
	<title>{metaTitle}</title>
	<meta name="description" content={metaDesc} />
</svelte:head>

<main class="header pt-3" in:fly={{ x: 150, duration: $page.data.animation, easing: backOut }}>
	<div class='column max-w-full s-stretch g-card'>
		<div class='column gap-2.5'>
			<h1>{category.name}</h1>
			{#if childs}
				<div class='flex gap-2.5' style='overflow: scroll'>
					{#each childs as category}
						<div class='btn-nav bor f-s0'><a href='/catalog/showcases/category/{category.slug}'>{category.name}</a></div>
					{/each}
				</div>
			{/if}
		</div>
		<ul class='product-list f-g1'>
			{#if products}
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
			{/if}
		</ul>
	</div>
</main>

<button class='add-product btn-icon fcc rounded-2xl'><Add fill='currentColor'/></button>

<style lang='postcss'>
    .btn-nav {
        padding: 4px 8px;
				background: white;
        @apply rounded-lg;
				a {color: #696969;}
    }
    .add-product {
        position: fixed;
        bottom: 28px;
        left: calc(var(--sidebar) + 28px);
        width: 39px;
        height: 39px;
        border: 1px solid #8B5D42;
    }
    @media (orientation:portrait) and (max-width:900px){.add-product {left: 15px;bottom: calc(var(--sidebar) - 1px)}}
</style>

