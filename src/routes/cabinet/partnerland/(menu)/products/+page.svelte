<script lang="ts">
	import { Trash, Edit, Add } from '$lib/ui/icons';
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { getProductsAvatarURL } from '$lib/internal/files';
	import RecordPanelEl from './RecordPanel.svelte';

	const categories = $page.data.categories ? JSON.parse($page.data.categories.toString()) : []
	$: products = $page.data.products ? JSON.parse($page.data.products.toString()) : [];

	let recordPanel;
	let productData = {id: "", name: "", slug: "", desc: "", width: "", length: "", height: "", weight: ""}, selectedCategories = [], avatarMain = "";

	const edit = (index: number) => {
		productData.id = products[index].id;
		productData.name = products[index].name;
		productData.slug = products[index].slug;
		productData.desc = products[index].desc;
		productData.width = products[index].width;
		productData.length = products[index].length;
		productData.height = products[index].height;
		productData.weight = products[index].weight;
		selectedCategories =  products[index].categories;
		avatarMain = products[index].avatarMain;
		recordPanel.open(productData, selectedCategories, avatarMain);
	}
</script>

{#if products?.length > 0}
	<div class='column gap-2' in:fly={{ x: 150, duration: $page.data.animation, easing: backOut }}>
		{#each products as product, index}
			<div class='flex v-center cursor-pointer bgw bor p-2.5 gap-2.5 rounded-2xl'>
				<div class='column gap-2.5'>
					<button class='btn-icon fcc rounded-2xl' on:click={() => edit(index)}><Edit fill='currentColor'/></button>
					<button class='btn-icon fcc rounded-2xl' on:click={() => edit(index)}><Trash fill='currentColor'/></button>
				</div>
				<div class='fcc'><img width='80' height='80' src={getProductsAvatarURL(product.id, product.avatarMain)} alt='' /></div>

				<div class='column g-sb s-stretch'>
					<div class='font-bold'>{product.name}</div>
					<div>Цена</div>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<div class='fcc h-full' in:fly={{ x: 150, duration: $page.data.animation, easing: backOut }}>
		Товаров не найдено
	</div>
{/if}

<button class='add-product btn-icon fcc rounded-2xl' on:click={() => recordPanel.newRecord()}><Add fill='currentColor'/></button>

<RecordPanelEl bind:this={recordPanel} {categories}/>

<style>
	.add-product {
			position: fixed;
			bottom: 28px;
			right: 28px;
			width: 39px;
      height: 39px;
			border: 1px solid #8B5D42;
	}
  @media (orientation:portrait) and (max-width:900px){.add-product {right: 15px;bottom: calc(var(--sidebar) - 1px)}}
</style>