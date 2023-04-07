<script lang="ts">
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { page } from "$app/stores";
	import HouseholdGoods from '$lib/ui/catalog/HouseholdGoods.svelte';
	import DecorativeGoods from '$lib/ui/catalog/DecorativeGoods.svelte';
	import AccessoriesAndMementos from '$lib/ui/catalog/AccessoriesAndMementos.svelte';
	import ToysAndGames from '$lib/ui/catalog/ToysAndGames.svelte';
	import GiftSets from '$lib/ui/catalog/GiftSets.svelte';
	import EdibleBouquets from '$lib/ui/catalog/EdibleBouquets.svelte';
	import Confectionery from '$lib/ui/catalog/Confectionery.svelte';
	import Flowers from '$lib/ui/catalog/Flowers.svelte';
</script>

<svelte:head>
	<title>{$page.data.metaTitle}</title>
	<meta name="description" content={$page.data.metaDesc} />
</svelte:head>

<main class="header pt-3" in:fly={{ x: 150, duration: $page.data.animation, easing: backOut }}>
	<div class='page'>
		<ul class='l-ui category-list grid w-full sm:w-11/12 calibri s-center'>
			<li class='l-ui aspect-w-5 aspect-h-4 rounded-xl'>
				<a class='column g-sb v-center w-full h-full p-2.5 gap-1' href='/catalog/showcases/category/household-goods'>
					<div class='fcc f-s1 min-w-0 min-h-0 mb-px'><HouseholdGoods /></div>
					<div class='title'>Товары<br>для дома</div>
				</a>
			</li>
			<li class='l-ui aspect-w-5 aspect-h-4 rounded-xl'>
				<a class='column g-sb v-center w-full h-full p-2.5 gap-1' href='/catalog/showcases/category/decorative-goods'>
					<div class='fcc f-s1 min-w-0 min-h-0 mb-px'><DecorativeGoods /></div>
					<div class='title'>Декоративные<br>товары</div>
				</a>
			</li>
			<li class='l-ui aspect-w-5 aspect-h-4 rounded-xl'>
				<a class='column g-sb v-center w-full h-full p-2.5 gap-1' href='/catalog/showcases/category/accessories-and-mementos'>
					<div class='fcc f-s1 min-w-0 min-h-0 mb-px'><AccessoriesAndMementos /></div>
					<div class='title'>Аксессуары и<br>сувениры</div>
				</a>
			</li>
			<li class='l-ui aspect-w-5 aspect-h-4 rounded-xl'>
				<a class='column g-sb v-center w-full h-full p-2.5 gap-1' href='/catalog/showcases/category/toys-and-games'>
					<div class='fcc f-s1 min-w-0 min-h-0 mb-px'><ToysAndGames /></div>
					<div class='title'>Игрушки и<br>игры</div>
				</a>
			</li>
			<li class='l-ui aspect-w-5 aspect-h-4 rounded-xl'>
				<a class='column g-sb v-center w-full h-full p-2.5 gap-1' href='/catalog/showcases/category/gift-sets'>
					<div class='fcc f-s1 min-w-0 min-h-0 mb-px'><GiftSets /></div>
					<div class='title'>Подарочные<br>наборы</div>
				</a>
			</li>
			<li class='l-ui aspect-w-5 aspect-h-4 rounded-xl'>
				<a class='column g-sb v-center w-full h-full p-2.5 gap-1' href='/catalog/showcases/category/confectionery'>
					<div class='fcc f-s1 min-w-0 min-h-0 mb-px'><Confectionery /> </div>
					<div class='title'>Кондитерские<br>изделия</div>
				</a>
			</li>
			<li class='l-ui aspect-w-5 aspect-h-4 rounded-xl'>
				<a class='column g-sb v-center w-full h-full p-2.5 gap-1' href='/catalog/showcases/category/edible-bouquets'>
					<div class='fcc f-s1 min-w-0 min-h-0 mb-px'><EdibleBouquets /></div>
					<div class='title'>Съедобные<br>букеты</div>
				</a>
			</li>
			<li class='l-ui aspect-w-5 aspect-h-4 rounded-xl'>
				<a class='column g-sb v-center w-full h-full p-2.5 gap-1' href='/catalog/showcases/category/flowers'>
					<div class='fcc f-s1 min-w-0 min-h-0 mb-px'><Flowers /></div>
					<div class='title' style='line-height: 200%;'>Цветы</div>
				</a>
			</li>
		</ul>
	</div>
</main>

<style lang="postcss">
  @import "/src/lib/adreano/scss/varibles.scss";
	.category-list{
		max-width: 930px;
		gap: $pd;
		grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
		li{
			background: $alt-accent;
			.title {
				@apply font-bold;
				color:$el-accent;
				font-size: 0.9rem;
				line-height: 100%;
				text-align: center;
			}
		}
	}
	@media (max-width: 690px) {
		.category-list{
			grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
		}
	}
</style>